import { useEffect, useState, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"; // Adjust the path if necessary
import useApi from "@/services/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";

export default function CarouselPlugin() {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const autoplayPlugin = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: false }) // Autoplay indefinitely
    );
    const api = useApi();

    // Fetch data from API using Axios
    useEffect(() => {
        const fetchTourTypes = async () => {
            try {
                setLoading(true);
                const response = await api.get("/api/tour-types"); // Replace with your Laravel API endpoint
                setSlides(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tour types:", error);
                setLoading(false);
            }
        };

        fetchTourTypes();
    }, []);

    return (
        <>
            {loading ? (
                <Skeleton className={`w-full h-[400px]`} showIcon={`true`}/>
            ) : (
                <Carousel
                    loop={true}
                    plugins={[autoplayPlugin.current]}
                    className="relative w-full"
                    onMouseEnter={() => autoplayPlugin.current.stop()}
                    onMouseLeave={() => autoplayPlugin.current.play()}
                >
                    <CarouselContent>
                        {slides.map((slide, index) => (
                            <CarouselItem key={index} className="relative">
                                <div>
                                    <img
                                        src={slide.image}
                                        alt={slide.name}
                                        className="w-full h-[420px]"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-75 hover:bg-opacity-0 transition-all duration-1000 ease-in-out flex items-center justify-center text-white p-6">
                                        <div className="text-center">
                                            <h2 className="text-4xl font-bold mb-4">{slide.name}</h2>
                                            <p className="mb-6">{slide.description}</p>
                                            {slide.id && (
                                                <Link to={`/tours/typs/${slide.id}`}>
                                                    <Button variant="waguer2" className="w-1/2">
                                                        Discover {slide.name}
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            )}
        </>
    );
}
