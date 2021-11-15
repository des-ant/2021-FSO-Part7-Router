import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { createStore } from 'redux';

const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return { ...state, message: action.data.message, type: action.data.type };
    case 'CLEAR_NOTIFICATION':
      return null;
    default:
      return state;
  }
};

export const store = createStore(notificationReducer);

const renderApp = () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
};

renderApp();
store.subscribe(renderApp);