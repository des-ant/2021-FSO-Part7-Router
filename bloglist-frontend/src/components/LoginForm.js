import React from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div>
      username
      <input
        id='username'
        type="text"
        name="username"
      />
    </div>
    <div>
      password
      <input
        id='password'
        type="password"
        name="password"
      />
    </div>
    <button id="login-button" type="submit">login</button>
  </form>
);

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default LoginForm;