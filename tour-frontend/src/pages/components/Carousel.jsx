import { useEffect, useState, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import useApi from "@/services/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { ArrowRight, Compass } from "lucide-react";

export default function CarouselPlugin() {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    
    const autoplayPlugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: false })
    );

    const carouselRef = useRef(null);
    
    const api = useApi();

    useEffect(() => {
        const fetchTourTypes = async () => {
            try {
                setLoading(true);
                const response = await api.get("/api/tour-types");
                setSlides(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tour types:", error);
                setLoading(false);
            }
        };

        fetchTourTypes();
    }, []);

    const handleSlideChange = () => {
        if (carouselRef.current) {
            const emblaApi = carouselRef.current.emblaApi;
            if (emblaApi) {
                setActiveIndex(emblaApi.selectedScrollSnap());
            }
        }
    };

    if (loading) {
        return (
            <div className="relative w-full">
                <Skeleton className="w-full h-[420px] bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Compass className="w-16 h-16 text-gray-400 animate-spin" />
                    </div>
                </Skeleton>
            </div>
        );
    }

    return (
        <div className="relative w-full">
            <Carousel
                ref={carouselRef}
                loop={true}
                plugins={[autoplayPlugin.current]}
                className="w-full"
                onMouseEnter={() => autoplayPlugin.current.stop()}
                onMouseLeave={() => autoplayPlugin.current.play()}
                onScroll={handleSlideChange}
            >
                <CarouselContent>
                    {slides.map((slide, index) => (
                        <CarouselItem key={index} className="relative">
                            <div className="relative group overflow-hidden h-[420px]">
                                <img
                                    src={slide.image}
                                    alt={slide.name}
                                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-1000"
                                />
                                
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-100 group-hover:opacity-75 transition-opacity duration-500" />

                                {/* Content */}
                                <div className="absolute inset-0 flex items-center justify-center p-8">
                                    <div className="text-center max-w-3xl transform translate-y-0 group-hover:-translate-y-4 transition-transform duration-500">
                                        <h2 className="text-4xl font-bold mb-4 text-white tracking-tight">
                                            {slide.name}
                                        </h2>
                                        <p className="text-lg text-gray-200 mb-6 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                            {slide.description}
                                        </p>
                                        {slide.id && (
                                            <Link to={`/tour/types/${slide.slug}`}>
                                                <Button 
                                                    variant="waguer2"
                                                    className="group relative px-6 py-2 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
                                                >
                                                    <span className="relative z-10 flex items-center gap-2">
                                                        Discover {slide.name}
                                                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Custom Navigation Buttons */}
                <CarouselPrevious className="left-4 bg-white/10 hover:bg-orange-400 backdrop-blur-sm border-none text-white" />
                <CarouselNext className="right-4 bg-white/10 hover:bg-orange-400 backdrop-blur-sm border-none text-white" />
            </Carousel>
        </div>
    );
}