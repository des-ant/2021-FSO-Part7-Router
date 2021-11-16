import blogService from '../services/blogs';

// const byLikes = (b1, b2) => b2.likes - b1.likes;

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT':
      return action.data;
    default:
      return state;
  }
};

export const initializeBlogs = () => {
  return async dispatch => {
    const data = await blogService.getAll();
    dispatch({
      type: 'INIT',
      data,
    });
  };
};

export default reducer;