import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import AdminLayout from './components/layout/AdminLayout';
import PublicLayout from './components/layout/PublicLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPosts from './pages/admin/Posts';
import AdminComments from './pages/admin/Comments';
import AdminUsers from './pages/admin/Users';
import Login from './pages/auth/Login';
import BlogList from './pages/blog/BlogList';
import BlogPost from './pages/blog/BlogPost';
export function App() {
  return <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="comments" element={<AdminComments />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<BlogList />} />
          <Route path="post/:id" element={<BlogPost />} />
        </Route>
      </Routes>
    </BrowserRouter>;
}