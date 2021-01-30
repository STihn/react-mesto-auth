import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, forRegistered, ...props }) => {
  return (
      <Route>
        {
          () => (props.loggedIn ? <Component {...props} /> : <Redirect to='/sign-in' />)
        }
      </Route>
  )
};

export default ProtectedRoute;