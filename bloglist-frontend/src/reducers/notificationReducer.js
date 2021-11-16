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

export const setNotification = (message, type='success') => {
  return {
    type: 'SET_NOTIFICATION',
    data: {
      message,
      type,
    },
  };
};

export const clearNotification = () => (
  { type: 'CLEAR_NOTIFICATION' }
);

export default notificationReducer;