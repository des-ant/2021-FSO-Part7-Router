import React from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from '@material-ui/core';

const LoginForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div>
      <TextField
        label="username"
        id="username"
        type="text"
        name="username"
      />
    </div>
    <div>
      <TextField
        label="password"
        id="password"
        type="password"
        name="password"
      />
    </div>
    <div>
      <Button
        id="login-button"
        type="submit"
        variant="contained"
        color="primary"
      >
        login
      </Button>
    </div>
  </form>
);

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default LoginForm;