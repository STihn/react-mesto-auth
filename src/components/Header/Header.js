import React from 'react';
import { Link, Route } from 'react-router-dom';
import '../../index.css';
import HeaderLogo from '../../images/logo.svg';

const Header = (props) => {
  const { email, onLogOut } = props;
    return (
        <div className="header wrapper">
            <img className="header__logo" src={HeaderLogo} alt="Лототип сайта" />
            <div className="nav">
                <Route path="/sign-up">
                  <Link to="./sign-in" className="button nav__button">Войти</Link>
                </Route>
                <Route path="/sign-in">
                  <Link to="./sign-up" className="button nav__button">Регистрация</Link>
                </Route>
                <Route exact path="/">
                  <p className="nav__email">{email}</p>
                  <Link to="./sign-in" onClick={onLogOut} className="button nav__button nav__button_logout">Выйти</Link>
                </Route>
            </div>
        </div>
    );
};

export default Header;