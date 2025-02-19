/*import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaComment, FaShare, FaFacebook, FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';


export default function UserDashboard() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await axios.get(`http://localhost:5000/posts`);
    setPosts(response.data);
  };

  const handleCommentChange = (postId, value) => {
    setNewComment({ ...newComment, [postId]: value });
  };

  const handleAddComment = async (postId) => {
    if (!newComment[postId]) return;
    await axios.post(`/posts/${postId}/comments`, { text: newComment[postId] });
    setNewComment({ ...newComment, [postId]: '' });
    fetchPosts();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-pink-600 text-center">WhatsNew</h1>
      <div className="mt-6">
        {posts.map((post) => (
          <div key={post._id} className="border border-gray-400 p-4 my-3 bg-white rounded-lg shadow-md">
            <h2 className="font-bold text-pink-600">{post.title}</h2>
            <p>{post.content}</p>
            <div className="flex space-x-4 mt-2">
              <button className="text-red-500 hover:text-red-600"><FaHeart /></button>
              <button className="text-light-blue-500 hover:text-light-blue-600"><FaComment /></button>
              <button className="text-green-500 hover:text-green-600"><FaShare /></button>
            </div>
            <div className="mt-4">
              <input
                className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                type="text"
                placeholder="Add a comment..."
                value={newComment[post._id] || ''}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
              />
              <button
                className="bg-pink-500 text-white p-2 mt-2 rounded-md hover:bg-pink-600"
                onClick={() => handleAddComment(post._id)}
              >
                Comment
              </button>
            </div>
          </div>
        ))}
      </div>
      <footer className="mt-6 text-center text-black text-sm">
        <p>Designed and coded by Metro-Plus Technologies</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="text-pink-600 hover:text-pink-700"><FaFacebook size={20} /></a>
          <a href="#" className="text-pink-600 hover:text-pink-700"><FaTwitter size={20} /></a>
          <a href="#" className="text-pink-600 hover:text-pink-700"><FaInstagram size={20} /></a>
          <a href="#" className="text-pink-600 hover:text-pink-700"><FaTiktok size={20} /></a>
        </div>
      </footer>
    </div>
  );
}
*/
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaComment, FaShare, FaFacebook, FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [comments, setComments] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:5000/posts/${postId}/comments`);
      setComments((prev) => ({ ...prev, [postId]: response.data }));
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleCommentChange = (postId, value) => {
    setNewComment({ ...newComment, [postId]: value });
  };

//new comment
  const handleAddComment = async (postId) => {
    if (!newComment[postId]) return;
    try {
      // Send the correct data (author and content)
      await axios.post(`http://localhost:5000/posts/${postId}/comments`, {
        author: "Anonymous",  // This should be the user's name if available
        content: newComment[postId],  // Content of the comment
      });

      // Clear the comment input field and fetch updated comments
      setNewComment({ ...newComment, [postId]: "" });
      fetchComments(postId);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
};  

  const handleEditComment = (postId, comment) => {
    setEditingComment(comment._id);
    setEditedComment(comment.text);
  };

  const handleUpdateComment = async (postId, commentId) => {
    try {
      await axios.put(`http://localhost:5000/posts/${postId}/comments/${commentId}`, {
        text: editedComment,
      });
      setEditingComment(null);
      fetchComments(postId);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button onClick={() => navigate("/")} className="text-pink-600 font-bold">
        ⬅ Go Back
      </button>
      
      <h1 className="text-3xl font-bold text-pink-600 text-center">WhatsNew</h1>
      <div className="mt-6">
        {posts.map((post) => (
          <div key={post._id} className="border border-gray-400 p-4 my-3 bg-white rounded-lg shadow-md">
            <h2 className="font-bold text-pink-600">{post.title}</h2>
            <p>{post.content}</p>
            <div className="flex space-x-4 mt-2">
              <button className="text-red-500 hover:text-red-600"><FaHeart /></button>
              <button className="text-blue-500 hover:text-blue-600" onClick={() => fetchComments(post._id)}><FaComment /></button>
              <button className="text-green-500 hover:text-green-600"><FaShare /></button>
            </div>
            <div className="mt-4">
              <input
                className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                type="text"
                placeholder="Add a comment..."
                value={newComment[post._id] || ""}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
              />
              <button
                className="bg-pink-500 text-white p-2 mt-2 rounded-md hover:bg-pink-600"
                onClick={() => handleAddComment(post._id)}
              >
                Comment
              </button>
            </div>
            {comments[post._id] && (
              <div className="mt-4">
                <h3 className="text-lg font-bold">Comments</h3>
                {comments[post._id].map((comment) => (
                  <div key={comment._id} className="border p-2 mt-2 rounded-md">
                    {editingComment === comment._id ? (
                      <>
                        <input
                          className="border border-gray-400 p-1 w-full rounded-md"
                          type="text"
                          value={editedComment}
                          onChange={(e) => setEditedComment(e.target.value)}
                        />
                        <button
                          className="bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600 mt-1"
                          onClick={() => handleUpdateComment(post._id, comment._id)}
                        >
                          Update
                        </button>
                      </>
                    ) : (
                      <>
                        <p>{comment.text}</p>
                        <button
                          className="text-sm text-blue-500 hover:text-blue-600"
                          onClick={() => handleEditComment(post._id, comment)}
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <footer className="mt-6 text-center text-black text-sm">
        <p>Designed and coded by Metro-Plus Technologies</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="text-pink-600 hover:text-pink-700"><FaFacebook size={20} /></a>
          <a href="#" className="text-pink-600 hover:text-pink-700"><FaTwitter size={20} /></a>
          <a href="#" className="text-pink-600 hover:text-pink-700"><FaInstagram size={20} /></a>
          <a href="#" className="text-pink-600 hover:text-pink-700"><FaTiktok size={20} /></a>
        </div>
      </footer>
    </div>
  );
}
