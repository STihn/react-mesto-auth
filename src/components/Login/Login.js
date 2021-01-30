import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

function Login({ onLogin }) {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();

    onLogin(email, password)
      .then(() => resetForm())
      .then(() => history.push('/'))
      .catch((err) => console.log(err));
  };

  return (
    <div className="auth">
      <h2 className="auth__header">Вход</h2>
      <form className="auth__form auth__form_type_login" onSubmit={handleSubmit}>
        <input className="auth__input" id="email" required name="email" type="email" placeholder="Email" value={email} onChange={(evt) => setEmail(evt.target.value)} />
        <input className="auth__input" id="password" required name="password" type="password" placeholder="Пароль" value={password} onChange={(evt) => setPassword(evt.target.value)} />
        <button className="auth__submit" type="submit">Войти</button>
      </form>
      <Link to="./sign-up" className="button auth__link">Ещё не зарегистрированы? Регистрация</Link>
    </div>
  );
}

export default Login;