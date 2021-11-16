import React, { useState, useEffect, useRef } from 'react';
import { setNotification } from './reducers/notificationReducer';
import { useDispatch, useSelector } from 'react-redux';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

import loginService from './services/login';
import storage from './utils/storage';

import { initializeBlogs, createBlog, likeBlog, deleteBlog } from './reducers/blogReducer';

const App = () => {
  const dispatch = useDispatch();

  const [blogs, setBlogs] = useState([]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  const blogsRedux = useSelector(state => state.blogs);

  useEffect(() => {
    console.log(blogsRedux);
    setBlogs(blogsRedux);
  }, []);

  useEffect(() => {
    const user = storage.loadUser();
    setUser(user);
  }, []);

  const notifyWith = (message, type='success') => {
    dispatch(setNotification(message, type, 5));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username, password,
      });

      setUsername('');
      setPassword('');
      setUser(user);
      storage.saveUser(user);
      notifyWith(`${user.name} welcome back!`);
    } catch (exception) {
      notifyWith(`${exception.response.data.error}`, 'error');
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    setUser(null);
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
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
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