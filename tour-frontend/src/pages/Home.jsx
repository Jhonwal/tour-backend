// src/Home.js
import CarouselPlugin from "./components/Carousel";
import Destinations from "./components/Destination";
import Gate2MoroccoDescription from "./components/Gate2MoroccoDescription";
import Footer from "@/pages/components/Footer.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";
import {X} from "lucide-react";

export default function Home() {
    return (
        <div className="font-sans bg-[url('/images/sahara.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
            <div className={`bg-opacity-50 bg-orange-100`}>
                <CarouselPlugin id="carousel"/>
                <Gate2MoroccoDescription/>
                <div className="max-w-screen-lg mx-auto px-6 py-12">
                    <section id="Tours">
                        <Destinations/>
                        <Destinations/>
                    </section>
                    <section id="offers" className="py-12">
                        <h2 className="text-3xl font-bold font-verdana text-center mb-8 text-white bg-orange-500 p-2">Special
                            Offers</h2>
                        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-xl font-semibold mb-4">Spring Special: 20% Off All Tours!</h3>
                            <p className="mb-6">Book now and save on your dream Moroccan adventure.</p>
                            <button className="bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-gray-100">
                                Grab the Offer
                            </button>
                        </div>
                    </section>
                    <section id="testimonials" className="py-12">
                        <h2 className="text-3xl font-bold font-verdana text-center mb-8 text-white bg-orange-500 p-2">What
                            Our Customers Say</h2>
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <p className="text-gray-700 mb-4">An unforgettable experience! The guides were
                                    knowledgeable and friendly.</p>
                                <h4 className="text-gray-800 font-semibold">- Jane Doe</h4>
                            </div>
                            {/* Add more testimonials */}
                        </div>
                    </section>
                </div>
            </div>

            <Footer/>
        </div>
    );
}
