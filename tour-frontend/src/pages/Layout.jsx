import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, MapPin, User, FileText, Menu, X, Plane } from "lucide-react";
import { useEffect, useState } from "react";
import VisitorTracker from "@/services/visitorService";
import CookieConsentBanner from "@/services/CookieConsentBanner.jsx";
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

export default function Layout() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [tourTypes, setTourTypes] = useState([]);
    const api = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTourTypes = async () => {
            try {
                const response = await api.get("/api/tour-types");
                setTourTypes(response.data);
            } catch (error) {
                console.error("Error fetching tour types:", error);
            }
        };

        fetchTourTypes();
    }, []);


    const getNavLinkClass = (path) => {
        return location.pathname === path ? "nav-link-active" : "nav-link"; 
    };
    const getNavLinkClassTour = (path) => {
        return location.pathname.startsWith(path) ? "nav-link-active" : "nav-link";
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
                        <Menubar>
                            <MenubarMenu>
                                <MenubarTrigger className={getNavLinkClassTour('/tour/')}><Plane className="mr-4"/> Tours</MenubarTrigger>
                                <MenubarContent>
                                    {
                                        tourTypes.map((tourType) => (
                                            <MenubarSub key={tourType.id}>
                                                <MenubarSubTrigger onClick={() => handleRefreshType(tourType.slug)}>{tourType.name}</MenubarSubTrigger>
                                                <MenubarSubContent>
                                                    {tourType.tours?.map((tour) => (
                                                    <MenubarItem key={tour.id} onClick={() => handleRefreshTour(tour.slug)}>{tour.name}<span className="ml-8 text-sm">({tour.duration} days/nights)</span></MenubarItem>
                                                    ))}
                                                </MenubarSubContent>
                                            </MenubarSub>
                                        ))
                                    }
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                        <Link to="/check-booking" className={getNavLinkClass('/check-booking')}>
                            <User size={24} className="mr-2" />
                            Cheek your Quet
                        </Link>
                        <Link to="/blog" className={getNavLinkClassTour('/blog')}>
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
                        <Menubar>
                            <MenubarMenu>
                                <MenubarTrigger className={getNavLinkClassTour('/tour/')}><Plane className="mr-4"/> Tours</MenubarTrigger>
                                <MenubarContent>
                                    {
                                        tourTypes.map((tourType) => (
                                            <MenubarSub  key={tourType.id}>
                                                <MenubarSubTrigger onClick={() => handleRefreshType(tourType.id)}>{tourType.name}</MenubarSubTrigger>
                                                <MenubarSubContent>
                                                    {tourType.tours?.map((tour) => (
                                                    <MenubarItem key={tour.id} onClick={() => handleRefreshTour(tour.id)}>{tour.name}<span className="ml-8 text-sm">({tour.duration} days/nights)</span></MenubarItem>
                                                    ))}
                                                </MenubarSubContent>
                                            </MenubarSub>
                                        ))
                                    }
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                        <Link to="/check-booking" className={getNavLinkClass('/check-booking')} onClick={toggleMenu}>
                            <div className="flex items-center mb-2">
                                <User size={24} className="mr-2" />
                                Cheek your Quet
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
            <Footer/>
        </>
    );
}
