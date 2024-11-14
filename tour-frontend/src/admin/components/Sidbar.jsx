import {Home, LogOut, Menu, Newspaper, TentTree, UserRoundCog, X} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const getNavLinkClass = (path) => {
        if (location.pathname === path) {
            return "sidebar-active";
        }

        if (path !== '/admin' && location.pathname.startsWith(path)) {
            return "sidebar-active";
        }

        return "sidebar";
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex flex-row justify-between">
            {/* Sidebar toggle button for small screens */}
                <Menu size={32} strokeWidth={3}  onClick={toggleSidebar} className={`lg:hidden text-green-800 hover:text-green-600 fixed border-2 border-green-700 rounded-lg hover:border-green-600 top-2 left-4 p-2 focus:outline-none ${isSidebarOpen ? 'hidden' : ''}`}/>
            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out lg:block z-40`}>
                <div className="p-4 text-2xl font-bold flex justify-between items-center">
                    Dashboard
                    {/* Close button for sidebar */}
                    <X size={32} strokeWidth={3} onClick={closeSidebar} className="lg:hidden text-red-700 hover:text-red-500 border-2 border-red-700 rounded-lg hover:border-red-500"/>
                </div>
                <div>
                    <Link to="/admin" className={getNavLinkClass('/admin')} onClick={closeSidebar}>
                        <Home width={30} strokeWidth={3} className="mr-4 text-red-600" />
                        <span>Home</span>
                    </Link>
                    <Link to="/admin/tours" className={getNavLinkClass('/admin/tours')} onClick={closeSidebar}>
                        <TentTree size={28} strokeWidth={3} className="mr-4 text-green-600" />
                        <span>Tours</span>
                    </Link>
                    <Link to="/admin/bookings" className={getNavLinkClass('/admin/bookings')} onClick={closeSidebar}>
                        <Newspaper size={28} strokeWidth={3} className="mr-4 text-yellow-600" />
                        <span>Bookings</span>
                    </Link>
                    <Link to="/admin/profile" className={getNavLinkClass('/admin/profile')} onClick={closeSidebar}>
                        <UserRoundCog size={28} strokeWidth={3} className="mr-4 text-indigo-600" />
                        <span>Profile</span>
                    </Link>
                    <Link to="/admin/logout" className={getNavLinkClass('/admin/logout')} onClick={closeSidebar}>
                        <LogOut size={28} strokeWidth={3} className="mr-4 text-indigo-600" />
                        <span>Logout</span>
                    </Link>
                </div>
            </div>

            {/* Main content */}
            <main className={`flex-1 lg:ml-64 p-4 transition-all duration-300`}>
                <Outlet />
            </main>
        </div>
    );
}
