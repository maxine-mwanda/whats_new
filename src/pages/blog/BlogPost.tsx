import React from 'react';
import { useParams } from 'react-router-dom';
const BlogPost = () => {
  const {
    id
  } = useParams();
  return <div>
      <article className="prose lg:prose-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Blog Post</h1>
        <p className="text-gray-500">Post not found.</p>
      </article>
    </div>;
};
export default BlogPost;