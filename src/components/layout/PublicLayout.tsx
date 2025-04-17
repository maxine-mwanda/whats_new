import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { UserIcon } from 'lucide-react';
const PublicLayout = () => {
  return <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              Blog Platform
            </Link>
            <nav className="flex items-center space-x-4">
              <Link to="/login" className="flex items-center text-gray-600 hover:text-gray-900">
                <UserIcon className="w-5 h-5 mr-2" />
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-gray-600">
            © 2024 Blog Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>;
};
export default PublicLayout;