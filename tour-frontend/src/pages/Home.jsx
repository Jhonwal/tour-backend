import { useEffect, useState } from 'react';
import CarouselPlugin from "./components/Carousel";
import Destinations from "./components/Destination";
import Gate2MoroccoDescription from "./components/Gate2MoroccoDescription";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PartyPopper } from 'lucide-react';
import TestimonialList from './testemonials/TestimonialList';

export default function Home() {
    const [message, setMessage] = useState('');
    const [reference, setReference] = useState('');
    
    useEffect(() => {
        const storedMessage = localStorage.getItem('bookingMessage');
        const storedReference = localStorage.getItem('bookingReference');

        if (storedMessage && storedReference) {
            setMessage(storedMessage);
            setReference(storedReference);
        }

        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(
            `.bg-sahara { background-image: url('/images/sahara.jpg') !important; background-size: cover !important; background-position: center !important; background-repeat: no-repeat !important; background-attachment: fixed !important; }`,
            styleSheet.cssRules.length
        );
    }, []);

    const closeAlert = () => {
        localStorage.removeItem('bookingMessage');
        localStorage.removeItem('bookingReference');
        setMessage('');
        setReference('');
    };

    const copyReference = () => {
        if (reference) {
            navigator.clipboard.writeText(reference)
                .then(() => alert('Reference copied to clipboard!'))
                .catch(err => alert('Failed to copy reference'));
        }
    };

    return (
        <>
            {message && reference && (
                <Alert variant="success" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-4 max-w-xl w-full flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <PartyPopper className="h-6 w-6 mr-2" />
                            <div>
                                <AlertTitle>Success!</AlertTitle>
                                <AlertDescription className='grid grid-cols-1'>
                                    <p>{message}</p>
                                    <span className="font-bold text-lg cursor-pointer" onClick={copyReference}>
                                        Reference Code: {reference}
                                    </span>
                                </AlertDescription>
                            </div>
                        </div>
                    </div>
                </Alert>
            )}

            <div className="font-sans bg-sahara"  onClick={closeAlert}>
                <div className={`bg-opacity-50 bg-orange-100`}>
                    <CarouselPlugin id="carousel"/>
                    <Gate2MoroccoDescription/>
                    <div className="py-6 px-6 lg:px-16 mx-auto">
                        <section id="Tours">
                            <Destinations/>
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
            </div>
        </>
    );
}
