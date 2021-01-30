import React from 'react';
import { Link } from 'react-router-dom';

function Register({ onRegister }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    onRegister(email, password)
      .then(() => resetForm())
      .catch((err) => console.log(err));
  };

  return (
    <div className="auth">
      <h2 className="auth__header">Регистрация</h2>
      <form className="auth__form auth__form_type_register" onSubmit={handleSubmit}>
        <input className="auth__input" id="email" name="email" type="email" placeholder="Email" value={email} onChange={(evt) => setEmail(evt.target.value)} />
        <input className="auth__input" id="password" name="password" type="password" placeholder="Пароль" value={password} onChange={(evt) => setPassword(evt.target.value)} />
        <button className="auth__submit" type="submit">Зарегистрироваться</button>
      </form>
      <Link to="./sign-in" className="button auth__link">Уже зарегистрированы? Войти</Link>
    </div>
  );
}

export default Register;