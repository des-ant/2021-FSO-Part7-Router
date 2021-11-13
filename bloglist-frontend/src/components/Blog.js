import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, increaseLikes, deleteBlog, username }) => {
  const [visible, setVisible] = useState(false);

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
        <button onClick={increaseLikes}>like</button>
        <div>
          {`${blog.user ? blog.user.name : 'No Owner'}`}
        </div>
        {blog.user && blog.user.username === username &&
        <button onClick={deleteBlog}>remove</button>}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  increaseLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
};

export default Blog;