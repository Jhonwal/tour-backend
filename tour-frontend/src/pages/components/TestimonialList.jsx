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

const TestimonialList = () => {
    const api = useApi();
    const [testimonials, setTestimonials] = useState([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false); // State for popover visibility
    const [isLargeScreen, setIsLargeScreen] = useState(false); // Track screen size
    const [currentIndex, setCurrentIndex] = useState(0); // Track current carousel index

    const carouselRef = useRef(); // Reference to the carousel to get access to the carousel API

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await api.get("/api/testimonials");
                setTestimonials(response.data);
            } catch (error) {
                console.error("Error fetching testimonials:", error);
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
        <div className="bg-gray-100 bg-opacity-75 py-10">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Testimonials</h2>
            <Carousel
                ref={carouselRef} // Pass the carousel reference
                className="max-w-5xl p-2 mx-auto"
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
                                            <p className="text-gray-500 text-sm">{testimonial.email}</p>
                                            <p className="text-yellow-500 text-sm mt-1">
                                                {"★".repeat(testimonial.rating)}{" "}
                                                <span className="text-gray-400">{"☆".repeat(5 - testimonial.rating)}</span>
                                            </p>
                                            <p className="text-gray-700 mt-4">{testimonial.message}</p>
                                        </div>
                                    </div>
                                ))}
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* Progress Bar */}
            {totalItems > 1 && (
                <div className="relative mt-6">
                    <div className="h-2 bg-gray-300 rounded-full">
                        <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{
                                width: `${((currentIndex) / (totalItems - 1)) * 100}%`, // Progress based on current index
                                transition: "width 0.5s ease", // Smooth transition for the progress
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="max-w-md mx-auto my-3">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="waguer2">Add Yours</Button>
                    </PopoverTrigger>
                    <PopoverContent className="min-w-6xl"> {/* Popover width set to 2/3 screen */}
                        <TestemonialForm onSuccess={handleFormSuccess} />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

export default TestimonialList;
