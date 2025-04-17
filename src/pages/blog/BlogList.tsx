import React from 'react';
import { Link } from 'react-router-dom';
const BlogList = () => {
  return <div>
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
      <div className="grid gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">No blog posts found.</p>
        </div>
      </div>
    </div>;
};
export default BlogList;