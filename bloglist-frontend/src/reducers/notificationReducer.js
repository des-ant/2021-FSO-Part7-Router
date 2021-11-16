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

let timeoutID = null;

export const setNotification = (message, type='success', time) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: {
        message,
        type,
      },
    });

    if (timeoutID) {
      clearTimeout(timeoutID);
    }

    timeoutID = setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIFICATION'
      });
    }, time * 1000);
  };
};

export const clearNotification = () => (
  { type: 'CLEAR_NOTIFICATION' }
);

export default notificationReducer;