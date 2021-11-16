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

export default notificationReducer;