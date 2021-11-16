import blogService from '../services/blogs';

// Sort blogs by number of likes in descending order
const byLikes = (b1, b2) => b2.likes - b1.likes;

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT':
      return action.data.sort(byLikes);
    case 'CREATE':
      return [...state, action.data];
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

export const createBlog = (blog) => {
  return async dispatch => {
    const data = await blogService.create(blog);
    dispatch({
      type: 'CREATE',
      data,
    });
  };
};

export default reducer;