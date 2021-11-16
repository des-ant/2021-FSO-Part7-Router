import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';
import { setNotification } from './reducers/notificationReducer';
import { useDispatch, useSelector } from 'react-redux';

import { initializeBlogs } from './reducers/blogReducer';

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
    // Check if user details of logged-in user can be found on the local storage
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
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

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      );
      blogService.setToken(user.token);
      setUser(user);
      notifyWith('logged in successfully');
      setUsername('');
      setPassword('');
    } catch (exception) {
      notifyWith(`${exception.response.data.error}`, 'error');
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();

    // Logout user by removing login details from the local storage in browser
    window.localStorage.removeItem('loggedBlogappUser');

    // Remove user details from state, thus reloading the App UI
    setUser(null);
    notifyWith('logged out successfully');
  };

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      notifyWith(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`);
    } catch (exception) {
      notifyWith(`${exception.response.data.error}`, 'error');
    }
  };

  const increaseLikesOf = async (id) => {
    const blog = blogs.find(b => b.id === id);
    const changedBlog = { ...blog, likes: blog.likes + 1 };

    try {
      const returnedBlog = await blogService.update(id, changedBlog);
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog));
      notifyWith(`you liked blog ${returnedBlog.title}`);
    } catch (exception) {
      notifyWith(`${exception.response.data.error}`, 'error');
    }
  };

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter(blog => blog.id !== id));
      notifyWith('blog deleted successfully');
    } catch (exception) {
      notifyWith(`${exception.response.data.error}`, 'error');
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
          increaseLikes={() => increaseLikesOf(blog.id)}
          deleteBlog={() => deleteBlog(blog.id)}
          username={user ? user.username : null}
        />
      )}
    </div>
  );
};

export default App;