import React from 'react';
import PropTypes from 'prop-types';

const BlogForm = ({ createBlog }) => {
  const addBlog = (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const author = event.target.author.value;
    const url = event.target.url.value;
    createBlog({
      title,
      author,
      url,
    });
    event.target.title.value = '';
    event.target.author.value = '';
    event.target.url.value = '';
  };

  return (
    <div className='BlogFormDiv'>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id='title'
            type='text'
            name='title'
          />
        </div>
        <div>
          author:
          <input
            id='author'
            type='text'
            name='author'
          />
        </div>
        <div>
          url:
          <input
            id='url'
            type='text'
            name='url'
          />
        </div>
        <button id='blogform-button' type='submit'>create</button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;