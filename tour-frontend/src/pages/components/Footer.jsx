import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import useApi from '@/services/api';
import WaguerPolicy from '@/services/WaguerPolicy';
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import TermsOfService from '@/services/TermsOfService';
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
                console.error("Error fetching tour types:", error);
            }
        };

        const fetchPopularTours = async () => {
            try {
                const response = await api.get("/api/destinations/featured");
                setPopularTours(response.data);
            } catch (error) {
                console.error("Error fetching popular tours:", error);
            }
        };

        fetchTourTypes();
        fetchPopularTours();
    }, []);
    
    return (
        <footer className="w-full text-white header-waguer">
            <div className="container mx-auto px-4">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <img src={`/images/waguer.png`} className="w-32 mx-auto grayscale hover:grayscale-0 transition-all duration-300" alt="Agency Logo" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Contact Us Section */}
                    <div className='lg:place-items-start place-items-center'>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <p className="mb-2">1234 Travel Road, Wander City</p>
                        <p className="mb-2">Phone: +1 (123) 456-7890</p>
                        <p>Email: info@travelagency.com</p>
                    </div>

                    {/* Tour Types Section */}
                    <div className='lg:place-items-start place-items-center'>
                        <h3 className="text-lg font-semibold mb-4">Tour Types</h3>
                        <ul className="space-y-2">
                            {tourTypes.map((tourType) => (
                                <li key={tourType.id}>
                                    <a href={`/tours/${tourType.id}`} className="hover:underline">{tourType.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Popular Tours Section */}
                    <div className='lg:place-items-start place-items-center'>
                        <h3 className="text-lg font-semibold mb-4">Popular Tours</h3>
                        <ul className="space-y-2">
                            {popularTours.map((tour) => (
                                <li key={tour.id}>
                                    <a href={`/tours/${tour.id}`} className="hover:underline">{tour.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Links Section */}
                    <div className='lg:place-items-start place-items-center'>
                        <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                        <div className="flex flex-col space-y-4">
                            <div className="flex space-x-2">
                                <Facebook className="fill-blue-500" />
                                <a href="https://facebook.com" className="hover:text-blue-500">Facebook</a>
                            </div>
                            <div className="flex space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 stroke-1 fill-white hover:fill-black stroke-black" viewBox="0 0 24 24">
                                    <path d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z" />
                                </svg>
                                <a href="https://twitter.com" className="hover:text-black">X</a>
                            </div>
                            <div className="flex space-x-2">
                                <Instagram className="fill-rose-500" />
                                <a href="https://instagram.com" className="hover:text-red-500">Instagram</a>
                            </div>
                            <div className="flex space-x-2">
                                <Linkedin className="fill-blue-900 stroke-1" />
                                <a href="https://linkedin.com" className="hover:text-blue-900">LinkedIn</a>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
                {/* Footer Bottom Section */}
                <div className="text-center mt-8 pt-8 border-t-4 flex flex-wrap lg:gap-10 gap-2 justify-center border-gray-700 bg-orange-900">
                    <p className="mb-2">&copy; 2024 CMT. All rights reserved.</p>
                    <div>
                        <Sheet>
                            <SheetTrigger asChild>
                                <span className="hover:underline">Privacy Policy</span>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetHeader>
                                    <SheetTitle>Privacy Policy</SheetTitle>
                                </SheetHeader>
                                <WaguerPolicy/>
                                <SheetFooter />
                            </SheetContent>
                        </Sheet> |
                        <Sheet>
                            <SheetTrigger asChild>
                                <span className="hover:underline">Privacy Policy</span>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetHeader>
                                    <SheetTitle>Terms of Service</SheetTitle>
                                </SheetHeader>
                                    <TermsOfService/>
                                <SheetFooter />
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
        </footer>
    );
}