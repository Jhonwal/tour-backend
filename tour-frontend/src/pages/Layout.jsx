import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, MapPin, User, FileText, Menu, X } from "lucide-react";
import { useState } from "react";
import VisitorTracker from "@/services/visitorService";
import CookieConsentBanner from "@/services/CookieConsentBanner.jsx";

export default function Layout() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getNavLinkClass = (path) => {
        return location.pathname === path ? "nav-link-active" : "nav-link";
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <VisitorTracker />
            <CookieConsentBanner />
            <header className="header-waguer">
                <nav className="container mx-auto flex justify-between items-center p-4">
                    <div className="flex items-center">
                        <img src="/images/waguer.png" alt="logo" className="lg:w-32 md:w-28 w-20"/>
                    </div>
                    <div className="hidden md:flex space-x-4 items-center">
                        <Link to="/" className={getNavLinkClass('/')}>
                            <Home size={24} className="mr-2" />
                            Home
                        </Link>
                        <Link to="/destination" className={getNavLinkClass('/destination')}>
                            <MapPin size={24} className="mr-2" />
                            Destination
                        </Link>
                        <Link to="/tours" className={getNavLinkClass('/tours')}>
                            <User size={24} className="mr-2" />
                            Get a Quet
                        </Link>
                        <Link to="/blog" className={getNavLinkClass('/blog')}>
                            <FileText size={24} className="mr-2" />
                            Blog
                        </Link>
                    </div>
                    <div className="md:hidden">
                        <button onClick={toggleMenu} aria-label="Toggle Menu">
                            {isMenuOpen ? <X size={32} strokeWidth={3} className="text-red-700 hover:text-red-500 border-2 border-red-700 rounded-lg hover:border-red-500"/> : <Menu size={32} strokeWidth={3} className="text-green-800 hover:text-green-600  border-2 border-green-700 rounded-lg hover:border-green-600" />}
                        </button>
                    </div>
                </nav>
                {isMenuOpen && (
                    <div className="md:hidden shadow-md p-4">
                        <Link to="/" className={getNavLinkClass('/')} onClick={toggleMenu}>
                            <div className="flex items-center mb-2">
                                <Home size={24} className="mr-2" />
                                Home
                            </div>
                        </Link>
                        <Link to="/destination" className={getNavLinkClass('/destination')} onClick={toggleMenu}>
                            <div className="flex items-center mb-2">
                                <MapPin size={24} className="mr-2" />
                                Destination
                            </div>
                        </Link>
                        <Link to="/tours" className={getNavLinkClass('/tours')} onClick={toggleMenu}>
                            <div className="flex items-center mb-2">
                                <User size={24} className="mr-2" />
                                Get a Quet
                            </div>
                        </Link>
                        <Link to="/blog" className={getNavLinkClass('/blog')} onClick={toggleMenu}>
                            <div className="flex items-center mb-2">
                                <FileText size={24} className="mr-2" />
                                Blog
                            </div>
                        </Link>
                    </div>
                )}
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
}
