import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, MapPin, User, FileText, Menu, X, Plane, ChevronUp, Phone, MessageCircle } from "lucide-react"; // Import MessageCircle for WhatsApp icon
import { useEffect, useState } from "react";
import VisitorTracker from "@/services/visitorService";
import CookieConsentBanner from "@/services/CookieConsentBanner";
import Footer from "./components/Footer";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar";
import useApi from "@/services/api";
import { toast } from "react-toastify";

export default function Layout() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [tourTypes, setTourTypes] = useState([]);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const api = useApi();
    const navigate = useNavigate();
    const [phoneNumbers, setPhoneNumbers] = useState([]);

    const fetchPhoneNumbers = async () => {
        try {
            const response = await api.get('/api/phone-numbers');
            const data = response.data;
            setPhoneNumbers(data);
        } catch (error) {
            toast.error(error);
        }
    };
    const fetchTourTypes = async () => {
        try {
            const response = await api.get("/api/tour-types");
            setTourTypes(response.data);
            console.log('tourtypepepee',response)
        } catch (error) {
            toast.error("Error fetching tour types:", error);
        }
    };
    useEffect(() => {
        fetchTourTypes();
        fetchPhoneNumbers();

        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const getNavLinkClass = (path) => {
        const baseClass = "flex items-center transition-all duration-300 hover:bg-white/10";
        const scrolledClass = isScrolled ? "px-2 py-1 text-sm" : "px-4 py-2";
        return location.pathname === path 
            ? `${baseClass} ${scrolledClass} bg-white/20 font-semibold rounded-lg` 
            : `${baseClass} ${scrolledClass} rounded-lg`;
    };

    const getNavLinkClassTour = (path) => {
        const baseClass = "flex items-center transition-all duration-300 hover:bg-white/10";
        const scrolledClass = isScrolled ? "px-2 py-1 text-sm" : "px-4 py-2";
        const isActive = location.pathname.startsWith(path);
    
        return isActive 
            ? `${baseClass} ${scrolledClass} bg-white/20 font-semibold rounded-lg` 
            : `${baseClass} ${scrolledClass} rounded-lg`;
    };
    

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleRefreshType = (id) => {
        navigate(`/tour/types/${id}`);
        window.location.reload();
    };

    const handleRefreshTour = (id) => {
        navigate(`/tour/${id}`);
        window.location.reload();
    };

    // Randomly select a phone number
    const randomPhoneNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];

    return (
        <>
            <VisitorTracker />
            <CookieConsentBanner />
            <header className={`bg-gradient-to-r hover:bg-gradient-to-l from-[#c3631f] to-[#ce9f11] shadow-md top-0 z-50 transition-all duration-300 bg-opacity-0`}>
                <nav className="mx-auto flex justify-between items-center px-4">
                    <div className={`flex items-center transition-all duration-300 w-auto opacity-100`}>
                        <Link to="/">
                            <img 
                                src="/images/logo.svg" 
                                alt="logo" 
                                className="lg:w-28 md:w-24 w-20 lg:scale-125 md:scale-110 scale-105 transform lg:hover:scale-[1.3] md:hover:scale-105 hover:scale-100 transition-transform duration-300"
                            />
                        </Link>
                    </div>
                    
                    <div className={`hidden md:flex items-center text-white transition-all duration-300 mx-auto space-x-2`}>
                        <Link to="/" className={getNavLinkClass('/')}>
                            <Home size={20} className="mr-1" />
                            <span>Home</span>
                        </Link>
                        <Menubar className="bg-transparent border-none">
                            <MenubarMenu>
                                <MenubarTrigger className={getNavLinkClassTour('/tour/')}>
                                    <Plane size={20} className="mr-1" />
                                    <span>Tours</span>
                                </MenubarTrigger>
                                <MenubarContent className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white border-none">
                                    {tourTypes.map((tourType) => (
                                        <MenubarSub key={tourType.id}>
                                            <MenubarSubTrigger 
                                                className="hover:bg-white/10 focus:bg-white/20"
                                                onClick={() => handleRefreshType(tourType.slug)}
                                            >
                                                {tourType.name}
                                            </MenubarSubTrigger>
                                            <MenubarSubContent className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white border-none">
                                                {tourType.tours?.map((tour) => (
                                                    <MenubarItem 
                                                        key={tour.id} 
                                                        onClick={() => handleRefreshTour(tour.slug)}
                                                        className="hover:bg-white/10 focus:bg-white/20"
                                                    >
                                                        {tour.name}
                                                        <span className="ml-2 text-xs opacity-75">
                                                            ({tour.duration} days/nights)
                                                        </span>
                                                    </MenubarItem>
                                                ))}
                                            </MenubarSubContent>
                                        </MenubarSub>
                                    ))}
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                        <Link to="/check-booking" className={getNavLinkClass('/check-booking')}>
                            <User size={20} className="mr-1" />
                            <span>Check Booking</span>
                        </Link>
                        <Link to="/blog" className={getNavLinkClassTour('/blog')}>
                            <FileText size={20} className="mr-1" />
                            <span>Blog</span>
                        </Link>
                        <Link to="/contact-us" className={getNavLinkClass('/contact-us')}>
                            <Phone size={20} className="mr-1" />
                            <span>Contact</span>
                        </Link>
                    </div>

                    <button 
                        onClick={toggleMenu}
                        className={`md:hidden p-1 rounded-lg transition-all duration-300 scale-100`}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? (
                            <X size={24} className="text-white hover:scale-110 transition-transform" />
                        ) : (
                            <Menu size={24} className="text-white hover:scale-110 transition-transform" />
                        )}
                    </button>
                </nav>

                {/* Mobile Menu */}
                <div 
                    className={`md:hidden overflow-hidden transition-all duration-300 ${
                        isMenuOpen ? 'max-h-screen bg-gradient-to-b from-orange-600 to-yellow-600' : 'max-h-0'
                    }`}
                >
                    <div className="p-4 space-y-2 text-white">
                        <Link to="/" className={getNavLinkClass('/')} onClick={toggleMenu}>
                            <Home size={18} className="mr-2" />
                            <span>Home</span>
                        </Link>
                        <Menubar className="bg-transparent border-none w-full">
                            <MenubarMenu>
                                <MenubarTrigger className={`w-full ${getNavLinkClassTour('/tour/')}`}>
                                    <Plane className="mr-2" size={18} />
                                    <span>Tours</span>
                                </MenubarTrigger>
                                <MenubarContent className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white border-none">
                                {tourTypes.map((tourType) => (
                                        <MenubarSub key={tourType.id}>
                                            <MenubarSubTrigger 
                                                className="hover:bg-white/10 focus:bg-white/20"
                                                onClick={() => handleRefreshType(tourType.slug)}
                                            >
                                                {tourType.name}
                                            </MenubarSubTrigger>
                                            <MenubarSubContent className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white border-none">
                                                {tourType.tours?.map((tour) => (
                                                    <MenubarItem 
                                                        key={tour.id} 
                                                        onClick={() => handleRefreshTour(tour.slug)}
                                                        className="hover:bg-white/10 focus:bg-white/20"
                                                    >
                                                        {tour.name}
                                                        <span className="ml-2 text-xs opacity-75">
                                                            ({tour.duration} days/nights)
                                                        </span>
                                                    </MenubarItem>
                                                ))}
                                            </MenubarSubContent>
                                        </MenubarSub>
                                    ))}
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                        <Link to="/check-booking" className={getNavLinkClass('/check-booking')} onClick={toggleMenu}>
                            <User size={18} className="mr-2" />
                            <span>Check Booking</span>
                        </Link>
                        <Link to="/blog" className={getNavLinkClass('/blog')} onClick={toggleMenu}>
                            <FileText size={18} className="mr-2" />
                            <span>Blog</span>
                        </Link>
                        <Link to="/contact-us" className={getNavLinkClass('/contact-us')}>
                            <Phone size={20} className="mr-1" />
                            <span>Contact</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="min-h-screen">
                <Outlet />
            </main>

            {/* WhatsApp Button */}
            <a
                href={`https://wa.me/${randomPhoneNumber}`}                            // Replace with your WhatsApp number
                target="_blank"
                rel="noopener noreferrer"
                className={`fixed bottom-20 right-6 p-3 rounded-full bg-green-500 text-white shadow-lg transform transition-all duration-300 hover:scale-110 z-50 ${
                    showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle size={24} />
            </a>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-6 right-6 p-3 rounded-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white shadow-lg transform transition-all duration-300 hover:scale-110 z-50 ${
                    showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                aria-label="Scroll to top"
            >
                <ChevronUp size={24} />
            </button>

            <Footer />
        </>
    );
}