// This file is the main entry point for the frontend application.
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './AdminFrontend.js';
import UserDashboard from './UserFrontend.js';

function App() {
  return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />}  />
        <Route path="/reader" element={<UserDashboard />} />
      </Routes>
  );
} 
export default App;
