import React, { useEffect, useState, useRef } from "react";
import useApi from "@/services/api";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TestemonialForm from "./TestemonialForm";
import './styles.css';
import { toast } from "react-toastify";

const TestimonialList = () => {
    const api = useApi();
    const [testimonials, setTestimonials] = useState([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false); // State for popover visibility
    const [isLargeScreen, setIsLargeScreen] = useState(false); // Track screen size
    const [loading, setLoading] = useState(true);

    const carouselRef = useRef(); // Reference to the carousel to get access to the carousel API

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await api.get("/api/testimonials");
                const testimonialsArray = Object.values(response.data); // Convert object to array
                setTestimonials(testimonialsArray); // Update state with the array
                setLoading(false);
            } catch (error) {
                toast.error("Error fetching testimonials:", error);
            }
        };
        
        
        fetchTestimonials();

        // Check for screen size on mount and resize
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024); // 1024px as the threshold for 'lg' screens
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Set the initial screen size

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleFormSuccess = () => {
        setIsPopoverOpen(false); // Close the popover when the form is successfully submitted
        // Optionally refetch the testimonials to include the new one
        api.get("/api/testimonials").then((response) => setTestimonials(response.data));
    };

    const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

    const itemsPerCarouselItem = isLargeScreen ? 2 : 1; // 2 items for large screens, 1 item for smaller screens

    const totalItems = Math.ceil(testimonials.length / itemsPerCarouselItem);

    // Update current index whenever the carousel changes
    const onCarouselSelect = (index) => {
        setCurrentIndex(index); // Update current index when carousel is changed
    };

    return (
        <div className="bg-gray-100 bg-opacity-75 pb-5 rounded-t-lg">
            <h2 className="text-3xl font-bold font-verdana text-center mb-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg shadow-md">What Our Customers Say.</h2>
            <p className="text-center text-lg font-semibold font-verdana text-orange-600 mb-8">
                We take great pride in delivering exceptional services to our customers. Here's what some of them have to say about their experiences with us. Their feedback motivates us to continue improving and providing the best service possible.
            </p>
            <Carousel
                ref={carouselRef} // Pass the carousel reference
                className="max-w-5xl p-4 mx-auto"
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                onSelect={onCarouselSelect} // Listen for carousel selection changes
            >
                <CarouselContent>
                    {Array.from({ length: totalItems }).map((_, index) => (
                        <CarouselItem key={index} className="flex space-x-4 justify-between">
                            {/* Display two testimonials at a time on large screens, one on smaller screens */}
                            {testimonials
                                .slice(index * itemsPerCarouselItem, index * itemsPerCarouselItem + itemsPerCarouselItem)
                                .map((testimonial) => (
                                    <div
                                        key={testimonial.id}
                                        className="bg-white shadow-lg rounded-lg p-6 flex items-start space-x-4 flex-1"
                                    >
                                        {/* User Avatar */}
                                        <img
                                            src={testimonial.avatar || "/default-avatar.png"}
                                            alt={`${testimonial.name}'s avatar`}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                        />

                                        {/* Testimonial Content */}
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-800">{testimonial.name}</h3>
                                            <p className="text-yellow-500 text-sm mt-1">
                                                {"★".repeat(testimonial.rating)}{" "}
                                                <span className="text-gray-400">{"☆".repeat(5 - testimonial.rating)}</span>
                                            </p>
                                            <div className="max-h-32 min-h-32 bg-orange-200 bg-opacity-50 p-2 shadow-md rounded-md overflow-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-transparent">
                                                <p className="text-orange-800 mt-4">{testimonial.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselNext/>
                <CarouselPrevious/>
            </Carousel>

            <div className="max-w-md mx-auto my-3">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="waguer2">Share Your Experience</Button>
                    </PopoverTrigger>
                    <PopoverContent className="min-w-6xl"> {/* Popover width set to 2/3 screen */}
                        <TestemonialForm onSuccess={handleFormSuccess} closePopover={setIsPopoverOpen}/>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

export default TestimonialList;
