import { ArrowLeft, Book, Home, LogOut, Menu, MessageCircle, Newspaper, TentTree, UserRoundCog, X } from "lucide-react";
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
            <Menu 
                size={32} 
                strokeWidth={3}  
                onClick={toggleSidebar} 
                className={`lg:hidden text-orange-600 hover:text-orange-400 fixed border-2 border-orange-700 rounded-lg hover:border-orange-600 top-2 left-4 p-2 focus:outline-none ${isSidebarOpen ? 'hidden' : ''}`}
            />
            
            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-orange-500 to-orange-200 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out lg:block z-40`}>
                <div className="p-4 text-2xl font-semibold flex justify-between items-center border-b border-orange-600">
                    Dashboard
                    {/* Close button for sidebar */}
                    <X 
                        size={32} 
                        strokeWidth={3} 
                        onClick={closeSidebar} 
                        className="lg:hidden text-red-700 hover:text-red-500 border-2 border-red-700 rounded-lg hover:border-red-500"
                    />
                </div>
                <div className="flex flex-col space-y-2 mt-4">
                    <Link 
                        to="/admin" 
                        className={getNavLinkClass('/admin')} 
                        onClick={closeSidebar} >
                        <Home width={30} strokeWidth={3} className="mr-4 text-white" />
                        <span className="text-lg">Home</span>
                    </Link>
                    <Link 
                        to="/admin/tours" 
                        className={getNavLinkClass('/admin/tours')} 
                        onClick={closeSidebar} >
                        <TentTree size={28} strokeWidth={3} className="mr-4 text-white" />
                        <span className="text-lg">Tours</span>
                    </Link>
                    <Link 
                        to="/admin/testimonials" 
                        className={getNavLinkClass('/admin/testimonials')} 
                        onClick={closeSidebar} >
                        <MessageCircle size={28} strokeWidth={3} className="mr-4 text-white" />
                        <span className="text-lg">Testimonials</span>
                    </Link>
                    <Link 
                        to="/admin/bookings" 
                        className={getNavLinkClass('/admin/bookings')} 
                        onClick={closeSidebar} >
                        <Newspaper size={28} strokeWidth={3} className="mr-4 text-white" />
                        <span className="text-lg">Bookings</span>
                    </Link>
                    {/* link to blog */}
                    <Link
                        to="/admin/blogs"
                        className={getNavLinkClass('/admin/blog')}
                        onClick={closeSidebar}>
                            <Book size={28} strokeWidth={3} className="mr-4 text-white" />
                            <span className="text-lg">Blog</span>
                    </Link>
                    <Link 
                        to="/admin/profile" 
                        className={getNavLinkClass('/admin/profile')} 
                        onClick={closeSidebar} >
                        <UserRoundCog size={28} strokeWidth={3} className="mr-4 text-white" />
                        <span className="text-lg">Profile</span>
                    </Link>
                    <Link 
                        to="/admin/logout" 
                        className={getNavLinkClass('/admin/logout')} 
                        onClick={closeSidebar} >
                        <LogOut size={28} strokeWidth={3} className="mr-4 text-white" />
                        <span className="text-lg">Logout</span>
                    </Link>
                </div>
            </div>

            {/* Main content */}
            <main className="flex-1 lg:ml-64 transition-all duration-300 relative">
                <Outlet />
                <button
                    onClick={() => window.history.back()}
                    className="fixed bottom-4 right-4 flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Go Back</span>
                </button>
            </main>

        </div>
    );
}
