import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

import Header from './Header/Header.js';
import Main from './Main/Main.js';
import Footer from './Footer/Footer.js';
import PopupWithForm from './PopupWithForm/PopupWithForm.js';
import PopupWithImage from './ImagePopup/ImagePopup.js';
import EditProfilePopup from './EditProfilePopup/EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup/EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup/AddPlacePopup.js';
import Login from './Login/Login.js';
import Register from './Register/Register.js';
import InfoToolTip from './InfoToolTip/InfoToolTip.js';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute.js';
import api from '../utils/Api.js';
import { register, getContent, authorize } from '../utils/auth.js';

import '../index.css';

import {CurrentUserContext} from '../contexts/CurrentUserContext.js';


function App () {

    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [selectedCard, setselectedCard] = React.useState({isOpen:false});
    const [currentUser, setCurrentUser] = React.useState({})
    const [currentCards, setCurrentCards] = React.useState([]);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [userData, setUserData] = React.useState({ email: '', _id: '' });
    const [toolTip, setToolTip] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [isInfoToolTipPopupOpen, setInfoToolTipPopupOpen] = React.useState(false);

    const history = useHistory();

    React.useEffect(() => {
        Promise.all([ api.getUserProfile(), api.getInitialCards() ])
            .then(([data, cards]) => {
                setCurrentUser(data)
                setCurrentCards(cards);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    function closeAllPopups() {
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setselectedCard(false);
        setInfoToolTipPopupOpen(false);
    }

    function handleCardClickPopupOpen({name, link}) {
        setselectedCard({...selectedCard, isOpen:true, name, link});
    }

    function handleEditProfilePopupOpen() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlacePopupOpen() {
        setIsAddPlacePopupOpen(true);
    }

    function handleEditAvatarPopupOpen() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleCardDelete(_id) {
        api.deleteCard(_id)
        .then(() => {
            const newCardLists = currentCards.filter((card) => {
                if(card._id !== _id) {
                    return true;
                }
            })
            setCurrentCards(newCardLists);
        })
        .catch(error => console.log(error));
    }

    function defineCard(_id, newCard) {
        const newCardLists = currentCards.map((card) => 
                    card._id === _id ? newCard : card
                );
                setCurrentCards(newCardLists);
    }
    
    function handleCardLike(_id, likes) {
        const isLiked = likes.some(i => i._id === currentUser._id);
        if(!isLiked) {
            api.likeCard(_id).then((newCard) => {
                defineCard(_id, newCard);
            })
            .catch(error => console.log(error));
        } else if(isLiked) {
            api.noLikeCard(_id).then((newCard) => {
                defineCard(_id, newCard)
            }) 
            .catch(error => console.log(error));
        }
    }

    function handleUpdateUser(data) {
        api.editProfile(data)
          .then((currentUser) => setCurrentUser(currentUser))
          .catch(error => console.log(error))
          .finally(closeAllPopups());
    }

    function handleUpdateAvatar(data) {
        api.editAvatar(data).then((newAvatar) => setCurrentUser(newAvatar))
        .catch(error => console.log(error))
        .finally(closeAllPopups());
    }

    function handleAddPlaceSubmit(data) {
        api.createCard(data).then((newCard) => setCurrentCards([newCard, ...currentCards]))
        .catch(error => console.log(error))
        .finally(closeAllPopups());
    }

    const onRegister = (email, password) => {
      return register(email, password)
        .then((res) => {
          if (res.data) {
            setToolTip(true)
            setMessage('Вы успешно зарегистрировались!')
            setInfoToolTipPopupOpen(true)
            history.push("/sign-in")
          }
        })
        .catch(res => {
            if (res === 400) {
                setToolTip(false)
                setInfoToolTipPopupOpen(true)
                setMessage(`некорректно заполнено одно из полей `);
                console.log('некорректно заполнено одно из полей ');
            }
        });
    };
  
    const tokenCheck = () => {
      let jwt = localStorage.getItem('jwt');
      if (jwt) {
        getContent(jwt).then((data) => {
          if (data) {
            setLoggedIn(true)
            setUserData(data.data)
          }
          history.push('/');
        })
        .catch(res => {
            if(res === 401) {
                console.log('Токен не передан или передан не в том формате');
            }
        });
      }
    };
  
    React.useEffect(() => {
      tokenCheck();
    }, []);
  
    const onLogin = (email, password) => {
      return authorize(email, password)
        .then((res) => {
            tokenCheck()
        })
        .catch((res) => {
            if (res === 400) {
                setToolTip(false)
                setInfoToolTipPopupOpen(true)
                setMessage(`Не передано одно из полей`);
                console.log('Не передано одно из полей');
            } else if (res === 401) {
                setToolTip(false)
                setInfoToolTipPopupOpen(true)
                setMessage(`Пользователь с email не найден`);
                console.log('пользователь с email не найден');
            }
        });
        
    }
  
    const onLogOut = () => {
      localStorage.removeItem('jwt');
      setLoggedIn(false);
      setUserData({ email: '', _id: '' });
    };
    
    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
                <Header 
                    email={userData.email} 
                    onLogOut={onLogOut}
                />
                <Switch>
                <ProtectedRoute exact path="/" 
                    component={Main} 
                    loggedIn={loggedIn} 
                    cards={currentCards}
                    onClickProfile={handleEditProfilePopupOpen} 
                    onClickAddPlace={handleAddPlacePopupOpen} 
                    onClickAvatar={handleEditAvatarPopupOpen} 
                    onClickImage={handleCardClickPopupOpen} 
                    onCardDelete={handleCardDelete}
                    onLike={handleCardLike}
                />
                <Route exact path="/sign-in">
                <Login onLogin={onLogin} />
                </Route>
                <Route exact path="/sign-up">
                <Register onRegister={onRegister} loggedIn={loggedIn} />
                </Route>
                <Route>
                    {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
                </Route>
                </Switch>
                <Footer />
                <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>
                <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>
                <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit}/>
                <PopupWithForm 
                name="toRemove" >
                    <form name="formToRemove" className="pop-up__form pop-up__form_toRemove">
                        <h2 className="pop-up__heading pop-up__heading_bottom">Вы уверены?</h2>
                        <button type="submit" name="deleteCard" className="pop-up__btnSubmit pop-up__btnSubmit_bottom">Да</button>
                    </form>
                </PopupWithForm>
                <PopupWithImage 
                onClose={closeAllPopups} 
                isOpen={selectedCard.isOpen} 
                name={selectedCard.name} 
                link={selectedCard.link}
                />
                <InfoToolTip
                isOpen={isInfoToolTipPopupOpen}
                onClose={closeAllPopups}
                toolTip={toolTip}
                message={message}
          />
            </div>
        </CurrentUserContext.Provider>
    )
}

export default App;
