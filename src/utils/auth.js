const BASE_URL = 'https://auth.nomoreparties.co';

export const register = (email, password) => {
    return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(res.json());
    })
    .catch(error => console.log(error.message));
};
  
export const authorize = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (res.status === 400) {
        console.log('Не передано одно из полей');
      }
      else if (res.status === 401) {
        console.log('пользователь с email не найден');
      }
      return res.json();
    })
    .then((data) => {
      if (data.token) {
        localStorage.setItem('jwt', data.token);
        return data;
      }
    })
    .catch(error => console.log(error.message));
};

  export const getContent = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json()
      }
      return Promise.reject(res.json())
    })
    .then((data) => data)
    .catch(err => console.log(err.message));
};