import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

import loginService from './services/login';
import storage from './utils/storage';

import { setNotification } from './reducers/notificationReducer';
import { initializeBlogs, createBlog, likeBlog, deleteBlog } from './reducers/blogReducer';
import { setUser, clearUser } from './reducers/userReducer';

const App = () => {
  const dispatch = useDispatch();

  const [blogs, setBlogs] = useState([]);

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  const blogsRedux = useSelector(state => state.blogs);

  useEffect(() => {
    setBlogs(blogsRedux);
  }, []);

  useEffect(() => {
    const userLoggedIn = storage.loadUser();
    if (userLoggedIn) {
      dispatch(setUser(userLoggedIn));
    }
  }, []);

  const user = useSelector(state => state.user);

  const notifyWith = (message, type='success') => {
    dispatch(setNotification(message, type, 5));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    try {
      const user = await loginService.login({
        username, password,
      });
      event.target.username.value = '';
      event.target.password.value = '';
      dispatch(setUser(user));
      storage.saveUser(user);
      notifyWith(`${user.name} welcome back!`);
    } catch (exception) {
      notifyWith(`${exception.response.data.error}`, 'error');
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(clearUser());
    storage.logoutUser();
    notifyWith('logged out successfully');
  };

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      dispatch(createBlog(blogObject));
      notifyWith(`a new blog ${blogObject.title} by ${blogObject.author} added`);
    } catch (exception) {
      notifyWith(`${exception.response.data.error}`, 'error');
    }
  };

  const handleLike = async (id) => {
    const toLike = blogs.find(b => b.id === id);
    try {
      dispatch(likeBlog(toLike));
      notifyWith(`you liked blog ${toLike.title}`);
    } catch (exception) {
      notifyWith(`${exception.response.data.error}`, 'error');
    }
  };

  const handleRemove = async (id) => {
    const blogToRemove = blogs.find(b => b.id === id);
    const okToRemove = window.confirm(
      `Remove blog ${blogToRemove.title} by ${blogToRemove.author}`
    );
    if (okToRemove) {
      try {
        dispatch(deleteBlog(id));
        notifyWith('blog deleted successfully');
      } catch (exception) {
        notifyWith(`${exception.response.data.error}`, 'error');
      }
    }
  };

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm
          handleSubmit={handleLogin}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
      <h2>create new</h2>
      {blogForm()}
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={() => handleLike(blog.id)}
          handleRemove={() => handleRemove(blog.id)}
          username={user ? user.username : null}
        />
      )}
    </div>
  );
};

export default App;