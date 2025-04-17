import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboardIcon, FileTextIcon, MessageSquareIcon, UsersIcon, LogOutIcon } from 'lucide-react';
const AdminLayout = () => {
  const location = useLocation();
  const navigation = [{
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboardIcon
  }, {
    name: 'Posts',
    href: '/admin/posts',
    icon: FileTextIcon
  }, {
    name: 'Comments',
    href: '/admin/comments',
    icon: MessageSquareIcon
  }, {
    name: 'Users',
    href: '/admin/users',
    icon: UsersIcon
  }];
  return <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">Blog Admin</h1>
          </div>
          <nav className="mt-6">
            {navigation.map(item => {
            const Icon = item.icon;
            return <Link key={item.name} to={item.href} className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${location.pathname === item.href ? 'bg-gray-100' : ''}`}>
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>;
          })}
            <button className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 w-full">
              <LogOutIcon className="w-5 h-5 mr-3" />
              Logout
            </button>
          </nav>
        </div>
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>;
};
export default AdminLayout;