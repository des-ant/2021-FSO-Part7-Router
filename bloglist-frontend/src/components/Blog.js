import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { setNotification } from '../reducers/notificationReducer';
import { likeBlog, deleteBlog } from '../reducers/blogReducer';

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const userLoggedIn = useSelector(state => state.login);

  if (!blog) {
    return null;
  }

  const username = userLoggedIn ? userLoggedIn.username : null;

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = async () => {
    try {
      dispatch(likeBlog(blog));
      dispatch(setNotification(`you liked blog ${blog.title}`));
    } catch (exception) {
      dispatch(setNotification(`${exception.response.data.error}`, 'error'));
    }
  };

  const handleRemove = async () => {
    const okToRemove = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    );
    if (okToRemove) {
      try {
        dispatch(deleteBlog(blog.id));
        dispatch(setNotification('blog deleted successfully'));
      } catch (exception) {
        dispatch(setNotification(`${exception.response.data.error}`, 'error'));
      }
    }
  };

  return (
    <div style={blogStyle} className='blog'>
      <div>
        <span>{blog.title} {blog.author}</span>
        <button style={hideWhenVisible} onClick={toggleVisibility}>view</button>
        <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
      </div>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>likes <span className='likes'>{blog.likes}</span></div>
        <button onClick={handleLike}>like</button>
        <div>
          {`${blog.user ? blog.user.name : 'No Owner'}`}
        </div>
        {blog.user && blog.user.username === username &&
        <button onClick={handleRemove}>remove</button>}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
};

export default Blog;