const reducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, ...action.user };
    case 'CLEAR_USER':
      return null;
    default:
      return state;
  }
};

export const setUser = (user) => {
  return async dispatch => {
    dispatch({
      type: 'SET_USER',
      user,
    });
  };
};

export const clearUser = () => {
  return async dispatch => {
    dispatch({
      type: 'CLEAR_USER',
    });
  };
};

export default reducer;