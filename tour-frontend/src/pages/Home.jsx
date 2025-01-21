import { useEffect, useState } from 'react';
import CarouselPlugin from "./components/Carousel";
import Destinations from "./components/Destination";
import Gate2MoroccoDescription from "./components/Gate2MoroccoDescription";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Map, PartyPopper } from 'lucide-react';
import TestimonialList from './testemonials/TestimonialList';
import { Button } from '@/components/ui/button';
import { toast, ToastContainer } from 'react-toastify';

export default function Home() {
    
    useEffect(() => {
        const message = localStorage.getItem('bookingMessage');
        const refcode = localStorage.getItem("bookingReference");
        if (message && refcode) {
            toast.success(localStorage.getItem('bookingMessage') + localStorage.getItem("bookingReference"));
        }
        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(
            `.bg-sahara { background-image: url('/images/sahara.jpg') !important; background-size: cover !important; background-position: center !important; background-repeat: no-repeat !important; background-attachment: fixed !important; }`,
            styleSheet.cssRules.length
        );
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.removeItem('bookingMessage');
            localStorage.removeItem('bookingReference');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="font-sans bg-sahara">
                <div className={`bg-opacity-50 bg-orange-100`}>
                    <CarouselPlugin id="carousel"/>
                    <Gate2MoroccoDescription/>
                    <div className="py-6 px-6 lg:px-16 mx-auto">
                        <section id="Tours">
                            <Destinations/>
                            <div className='lg:max-w-md w-full mx-auto'>
                                <Button variant='waguer2' className='p-8'><Map/> <p className='ml-2'>View all sharming Morocco Tours</p></Button>
                            </div>
                        </section>
                        <section id="offers" className="py-12">
                            <h2 className="text-3xl font-bold font-verdana text-center mb-8 text-white bg-orange-500 p-2">Special Offers</h2>
                            <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md text-center">
                                <h3 className="text-xl font-semibold mb-4">Spring Special: 20% Off All Tours!</h3>
                                <p className="mb-6">Book now and save on your dream Moroccan adventure.</p>
                                <button className="bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-gray-100">
                                    Grab the Offer
                                </button>
                            </div>
                        </section>
                        <TestimonialList/>
                    </div>
                </div>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                />
            </div>
        </>
    );
}
