//import { useState, useEffect } from "react";

/*export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5000/posts";

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Handle creating a new post
  const handleCreatePost = async () => {
    if (!title || !content) return; // Prevent empty submissions

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) throw new Error("Failed to create post");

      const data = await response.json();
      setPosts([...posts, { id: data.id, title, content }]);
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle updating a post
  const handleUpdatePost = async () => {
    if (!editingPost) return;

    try {
      const response = await fetch(`${API_URL}/${editingPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) throw new Error("Failed to update post");

      setPosts(posts.map(post =>
        post.id === editingPost.id ? { ...post, title, content } : post
      ));
      setEditingPost(null);
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle deleting a post
  const handleDeletePost = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete post");

      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle selecting a post for editing
  const handleEditClick = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? <p>Loading...</p> : null}

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "300px" }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "300px", height: "100px" }}
        />
        {editingPost ? (
          <button onClick={handleUpdatePost} disabled={!title || !content}>Update Post</button>
        ) : (
          <button onClick={handleCreatePost} disabled={!title || !content}>Create Post</button>
        )}
      </div>

      <h2>Posts</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map(post => (
          <li key={post.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button onClick={() => handleEditClick(post)} style={{ marginRight: "10px" }}>Edit</button>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}*/

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const API_URL = "http://localhost:5000/posts";
  const LOGIN_URL = "http://localhost:5000/login";
  const REGISTER_URL= "http://localhost:5000/register";
  const [isRegistering, setIsRegistering] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (err) {
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  //handle registration
  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(REGISTER_URL, {
        username: "newUser", // This should be dynamically set, e.g., from a form input
        password: "newPassword", // This should be dynamically set, e.g., from a form input
        email: "user@example.com", // Additional field commonly used in registration
      });
      // Assuming the response contains a token and user data
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setIsAuthenticated(true);
      // Optionally, you might want to store user info in localStorage or context
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  //handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(LOGIN_URL, {
        username: "admin",
        password: "password",
      });
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setIsAuthenticated(true);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  const handleCreatePost = async () => {
    if (!title || !content) return;
    try {
      const response = await axios.post(API_URL, { title, content }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts([...posts, response.data]);
      setTitle("");
      setContent("");
    } catch (err) {
      setError("Failed to create post");
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;
    try {
      await axios.put(`${API_URL}/${editingPost.id}`, { title, content }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.map(post => post.id === editingPost.id ? { ...post, title, content } : post));
      setEditingPost(null);
      setTitle("");
      setContent("");
    } catch (err) {
      setError("Failed to update post");
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      setError("Failed to delete post");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setIsAuthenticated(false);
  };

  return (
    <div style={{ padding: "20px" }}>
  {!isAuthenticated ? (
    <>
      {isRegistering ? (
        <form onSubmit={handleRegistration}>
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <input type="email" placeholder="Email" required />
          <button type="submit">Register</button>
          <button type="button" onClick={() => setIsRegistering(false)}>Switch to Login</button>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
          <button type="button" onClick={() => setIsRegistering(true)}>Switch to Registration</button>
        </form>
      )}
    </>
  ) : (
    <>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? <p>Loading...</p> : null}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "300px" }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "300px", height: "100px" }}
        />
        {editingPost ? (
          <button onClick={handleUpdatePost} disabled={!title || !content}>Update Post</button>
        ) : (
          <button onClick={handleCreatePost} disabled={!title || !content}>Create Post</button>
        )}
      </div>
      <h2>Posts</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map(post => (
          <li key={post.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button onClick={() => setEditingPost(post)} style={{ marginRight: "10px" }}>Edit</button>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  )}
</div>
)}