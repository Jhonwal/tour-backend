import { useEffect, useState } from 'react';
import CarouselPlugin from "./components/Carousel";
import Destinations from "./components/Destination";
import Gate2MoroccoDescription from "./components/Gate2MoroccoDescription";
import { Map } from 'lucide-react';
import TestimonialList from './testemonials/TestimonialList';
import { Button } from '@/components/ui/button';
import { toast, ToastContainer } from 'react-toastify';
import FAQComponent from './components/FAQComponent';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
                            <h2 className="text-3xl font-bold font-verdana text-center mb-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg shadow-md">Special Offers</h2>
                            <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md text-center">
                                <h3 className="text-xl font-semibold mb-4">Spring Special: 20% Off All Tours!</h3>
                                <p className="mb-6">Book now and save on your dream Moroccan adventure.</p>
                                <button className="bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-gray-100">
                                    Grab the Offer
                                </button>
                            </div>
                        </section>
                        <TestimonialList/>
                        <FAQComponent n={3}/>
                        <div className='mx-auto bg-gray-100 bg-opacity-75 flex justify-center pb-4'>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="waguer2" className='font-semibold max-w-lg'>more</Button>
                                </SheetTrigger>
                                <SheetContent side="left">
                                    <FAQComponent/>
                                </SheetContent>
                            </Sheet>
                        </div>
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