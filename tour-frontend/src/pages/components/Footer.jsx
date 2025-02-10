import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import useApi from '@/services/api';
import WaguerPolicy from '@/services/WaguerPolicy';
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetTrigger,
} from "@/components/ui/sheet";
import TermsOfService from '@/services/TermsOfService';
import { toast } from 'react-toastify';

export default function Footer() {
    const [tourTypes, setTourTypes] = useState([]);
    const [popularTours, setPopularTours] = useState([]);
    const api = useApi();

    useEffect(() => {
        const fetchTourTypes = async () => {
            try {
                const response = await api.get("/api/tour-types");
                setTourTypes(response.data);
            } catch (error) {
                toast.error("Error fetching tour types:", error);
            }
        };

        const fetchPopularTours = async () => {
            try {
                const response = await api.get("/api/destinations/featured");
                setPopularTours(response.data);
            } catch (error) {
                toast.error("Error fetching popular tours:", error);
            }
        };

        fetchTourTypes();
        fetchPopularTours();
    }, []);
    
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    return (
        <footer className="w-full bg-gradient-to-b from-gray-700 to-gray-800 text-white">
            <div className="container mx-auto px-4 py-12">
                {/* Logo Section with Animation */}
                <div className="text-center mb-12">
                    <img 
                        src="/images/logo.svg" 
                        className="w-40 mx-auto transform hover:scale-110 transition-transform duration-300 cursor-pointer"
                        alt="Agency Logo" 
                        onClick={scrollToTop}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Contact Us Section */}
                    <div className="flex flex-col items-center lg:items-start">
                        <h3 className="text-xl font-bold mb-6 text-orange-400">Contact Us</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 hover:text-orange-400 transition-colors duration-200">
                                <MapPin className="w-5 h-5" />
                                <p>4413 N Kenneth avenue</p>
                            </div>
                            <div className="flex items-center gap-3 hover:text-orange-400 transition-colors duration-200">
                                <MessageCircle className="w-5 h-5" />
                                <p>+1 (312) 414-6237</p>
                            </div>
                            <div className="flex items-center gap-3 hover:text-orange-400 transition-colors duration-200">
                                <MessageCircle className="w-5 h-5" />
                                <p>+212 655-596912</p>
                            </div>
                            <div className="flex items-center gap-3 hover:text-orange-400 transition-colors duration-200">
                                <Mail className="w-5 h-5" />
                                <p>cm2ours@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Tour Types Section */}
                    <div className="flex flex-col items-center lg:items-start">
                        <h3 className="text-xl font-bold mb-6 text-orange-400">Tour Types</h3>
                        <ul className="space-y-3">
                            {tourTypes.map((tourType) => (
                                <li key={tourType.id} className="transform hover:translate-x-2 transition-transform duration-200">
                                    <a href={`/tour/types/${tourType.slug}`} className="hover:text-orange-400 transition-colors duration-200">
                                        {tourType.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Popular Tours Section */}
                    <div className="flex flex-col items-center lg:items-start">
                        <h3 className="text-xl font-bold mb-6 text-orange-400">Popular Tours</h3>
                        <ul className="space-y-3">
                            {popularTours.map((tour) => (
                                <li key={tour.id} className="transform hover:translate-x-2 transition-transform duration-200">
                                    <a href={`/tour/${tour.slug}`} className="hover:text-orange-400 transition-colors duration-200">
                                        {tour.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Links Section */}
                    <div className="flex flex-col items-center lg:items-start">
                        <h3 className="text-xl font-bold mb-6 text-orange-400">Follow Us</h3>
                        <div className="flex flex-col space-y-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-blue-500 transition-colors duration-200 group">
                                <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                                <span>Facebook</span>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-blue-400 transition-colors duration-200 group">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z" />
                                </svg>
                                <span>X</span>
                            </a>
                            <a href="https://www.instagram.com/charmintours2morocco" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-pink-500 transition-colors duration-200 group">
                                <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                                <span>Instagram</span>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-blue-700 transition-colors duration-200 group">
                                <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                                <span>LinkedIn</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom Section */}
            <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center items-center gap-6">
                        <p className="text-sm">&copy; 2024 CMT. All rights reserved.</p>
                        <div className="flex items-center gap-4">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <button className="text-sm hover:text-gray-200 transition-colors duration-200">
                                        Privacy Policy
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="left" className="bg-orange-50">
                                    <WaguerPolicy/>
                                    <SheetFooter />
                                </SheetContent>
                            </Sheet>
                            <span className="text-gray-300">|</span>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <button className="text-sm hover:text-gray-200 transition-colors duration-200">
                                        Terms of Service
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="left" className="bg-orange-50">
                                    <TermsOfService/>
                                    <SheetFooter />
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}