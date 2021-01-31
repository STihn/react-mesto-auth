class Api {
    constructor({baseUrl, headers}) {
      this.baseUrl = baseUrl;
      this.headers = headers
    }
    
    getInitialCards() {
      return fetch(`${this.baseUrl}/cards`,{
        method: 'GET',
        headers:  this.headers
      }).then(res => this._status(res));
    }

    likeCard(cardId){
      return fetch(`${this.baseUrl}/cards/likes/${cardId}`,{
        method: 'PUT',
        headers:  this.headers
      }).then(res => this._status(res));
    }

    noLikeCard(cardId) {
      return fetch(`${this.baseUrl}/cards/likes/${cardId}`,{
        method: 'DELETE',
        headers:  this.headers
      }).then(res => this._status(res));
    }

    deleteCard(cardId) {
      return fetch(`${this.baseUrl}/cards/${cardId}`,{
        method: 'DELETE',
        headers:  this.headers
      }).then(res => this._status(res));
    }

    createCard(data) {
      return fetch(`${this.baseUrl}/cards`, {
        method: 'POST',
        headers:  this.headers,
        body: JSON.stringify({
          name: data.name,
          link: data.link
        })
      }).then(res => this._status(res));
    }

    editProfile(data) {
      return fetch(`${this.baseUrl}/users/me`, {
        method: 'PATCH',
        headers:  this.headers,
        body: JSON.stringify({
            name: data.name,
            about: data.about
        })
      }).then(res => this._status(res));
    }

    editAvatar(data) {
      return fetch(`${this.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers:  this.headers,
        body: JSON.stringify({
            avatar: data.avatar
        })
      }).then(res => this._status(res));
    }

    getUserProfile() {
      return fetch(`${this.baseUrl}/users/me`,{
        method: 'GET',
        headers:  this.headers
      }).then(res => this._status(res));
    }

    _status(res) {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error - ${res.status}`);
    }
}

const api = new Api ({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-14',
  headers: {
      authorization: '6e586ab2-f36c-4d4a-abc3-ac2332162dcd',
      'content-type': 'application/json'
  }
});

export default api;