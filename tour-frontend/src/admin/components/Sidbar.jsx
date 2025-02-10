import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Book, 
  Guitar, 
  Home, 
  LogOut, 
  Menu, 
  MessageCircle, 
  Newspaper, 
  ShieldQuestion, 
  TentTree, 
  UserRoundCog, 
  X 
} from 'lucide-react';
import { getToken } from '@/services/getToken';
import useApi from '@/services/api';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <p className="text-gray-700 mb-4">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  };

const Sidebar = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const api = useApi();
    const navigate = useNavigate();

  
    const isLinkActive = (path) => {
      if (location.pathname === path) return true;
      if (path !== '/admin' && location.pathname.startsWith(path)) return true;
      return false;
    };
  
        const handleLogoutConfirm = async () => {
            try {
                const token = getToken();
                if (!token) throw new Error("No token found");

                await api.post('/api/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                localStorage.removeItem('token');
                navigate('/');
                setIsLogoutModalOpen(false);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Handle the case where the token might be invalid or expired
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

  
    const NavLink = ({ to, icon: Icon, children }) => (
      <Link
        to={to}
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center w-full px-6 py-2.5 transition-all duration-200 ${
          isLinkActive(to)
            ? 'bg-orange-100 text-orange-600'
            : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500'
        }`}
      >
        <Icon className="w-5 h-5 mr-3" strokeWidth={2} />
        <span className="font-medium">{children}</span>
      </Link>
    );
  
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={`fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md lg:hidden ${
            isSidebarOpen ? 'hidden' : 'block'
          }`}
        >
          <Menu className="w-6 h-6 text-orange-600" />
        </button>
  
        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
  
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
  
          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 mt-4">
            <NavLink to="/admin" icon={Home}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/tours" icon={TentTree}>
              Tours
            </NavLink>
            {/* add lien tour request  to tour-request */}
            <NavLink to="/admin/tour-requests" icon={TentTree}>
              Tour Requests
            </NavLink>
            <NavLink to="/admin/testimonials" icon={MessageCircle}>
              Testimonials
            </NavLink>
            {/* add on for activities */}
            <NavLink to="/admin/activities" icon={Guitar}>
              Activities
            </NavLink>
            <NavLink to="/admin/bookings" icon={Newspaper}>
              Bookings
            </NavLink>
            <NavLink to="/admin/blogs" icon={Book}>
              Blog
            </NavLink>
            <NavLink to="/admin/faqs" icon={ShieldQuestion}>
              FAQs
            </NavLink>
            <NavLink to="/admin/profile" icon={UserRoundCog}>
              Profile
            </NavLink>

            <div className="mt-4">
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center w-full px-6 py-2.5 text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="w-5 h-5 mr-3" strokeWidth={2} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </div>
  
        {/* Main Content */}
        <main className="lg:ml-64 min-h-screen">
          <div className="p-6">
            <Outlet />
          </div>
  
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </main>
  
        {/* Logout Confirmation Modal */}
        <ConfirmationModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogoutConfirm}
          message="Are you sure you want to logout? This action cannot be undone."
        />
      </div>
    );
  };
  
  export default Sidebar;