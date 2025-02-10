import { useEffect } from 'react';
import CarouselPlugin from "./components/Carousel";
import Destinations from "./components/Destination";
import Gate2MoroccoDescription from "./components/charmingMoroccoTors";
import TestimonialList from './testemonials/TestimonialList';
import { Button } from '@/components/ui/button';
import { toast, ToastContainer } from 'react-toastify';
import FAQComponent from './components/FAQComponent';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import SpecialOffersSection from './components/SpecialOffersSection';
import PersonalizedTourPromo from './components/PersonalizedTourPromo';

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
                <div className={``}>
                    <CarouselPlugin id="carousel"/>
                    <Gate2MoroccoDescription/>
                    <div className="py-6 px-6 lg:px-16 mx-auto">
                        <section id="Tours">
                            <Destinations/>
                            <PersonalizedTourPromo/>
                        </section>
                        <SpecialOffersSection/>
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