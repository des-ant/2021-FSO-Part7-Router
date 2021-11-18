import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Switch,
  Route,
} from 'react-router-dom';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import Users from './components/Users';
import User from './components/User';
import BlogList from './components/BlogList';

import loginService from './services/login';
import storage from './utils/storage';

import { setNotification } from './reducers/notificationReducer';
import { initializeBlogs, createBlog } from './reducers/blogReducer';
import { loginUser, logoutUser } from './reducers/loginReducer';
import { initializeUsers } from './reducers/userReducer';

const App = () => {
  const dispatch = useDispatch();

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUsers());
  }, [dispatch]);

  useEffect(() => {
    const userLoggedIn = storage.loadUser();
    if (userLoggedIn) {
      dispatch(loginUser(userLoggedIn));
    }
  }, []);

  const userLoggedIn = useSelector(state => state.login);

  const notifyWith = (message, type='success') => {
    dispatch(setNotification(message, type, 5));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    try {
      const userLoggedIn = await loginService.login({
        username, password,
      });
      event.target.username.value = '';
      event.target.password.value = '';
      dispatch(loginUser(userLoggedIn));
      storage.saveUser(userLoggedIn);
      notifyWith(`${userLoggedIn.name} welcome back!`);
    } catch (exception) {
      notifyWith(`${exception.response.data.error}`, 'error');
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logoutUser());
    storage.logoutUser();
    notifyWith('logged out successfully');
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    dispatch(createBlog(blogObject));
  };

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  if (userLoggedIn === null) {
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
      <p>{userLoggedIn.name} logged in</p>
      <button onClick={handleLogout}>logout</button>

      <Switch>
        <Route path="/users/:id">
          <User />
        </Route>

        <Route path="/users">
          <Users />
        </Route>

        <Route path="/">
          <h2>create new</h2>
          {blogForm()}
          <BlogList />
        </Route>
      </Switch>

    </div>
  );
};

export default App;