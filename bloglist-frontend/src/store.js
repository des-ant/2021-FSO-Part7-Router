import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import notificationReducer from './reducers/notificationReducer';

const reducer = combineReducers({
  notification: notificationReducer,
});

const store = createStore(
  reducer,
  composeWithDevTools()
);

export default store;