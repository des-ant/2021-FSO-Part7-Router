import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const blogs = useSelector(state => state.blogs);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div>
      {blogs.map(blog =>
        <div style={blogStyle} key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {`${blog.title} ${blog.author}`}
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogList;