import React, { useEffect, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import TourDet from '../tour/TourDet';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import useApi from '@/services/api';

const Destinations = () => {
    const api = useApi();
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for hover effect
    const [hoveredId, setHoveredId] = useState(null);

    // State for handling clicked destination
    const [clickedDestination, setClickedDestination] = useState(null);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await api.get('/api/destinations/featured');
                setDestinations(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                console.log(err);
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    // Skeleton Loader Component
    const SkeletonLoader = () => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-6 bg-orange-400 bg-opacity-30">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div> {/* Placeholder for duration */}
                <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div> {/* Placeholder for title */}
                <div className="h-20 bg-gray-300 rounded mb-4"></div> {/* Placeholder for description */}
                <div className="h-10 bg-gray-300 rounded w-1/3"></div> {/* Placeholder for button */}
            </div>
        </div>
    );

    const handleImageClick = (destination) => {
        setClickedDestination(destination);
    };

    const closeModal = () => {
        setClickedDestination(null);
    };

    if (loading) {
        return (
            <div>
                <section id="destinations" className="mb-12 font-verdana">
                    <h2 className="text-2xl font-bold text-center mb-12 relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg shadow-md">
                        Featured Tours
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <SkeletonLoader key={index} />
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <section id="destinations" className="mb-12 font-verdana">
                <h2 className="text-2xl font-bold text-center mb-12 relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg shadow-md">
                    Featured Tours
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {destinations.map((destination) => (
                        <div
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                            key={destination.id}
                            onMouseEnter={() => setHoveredId(destination.id)}  // Set hover state
                            onMouseLeave={() => setHoveredId(null)}  // Reset hover state
                        >
                            <img
                                src={hoveredId === destination.id ? destination.banner : destination.map_image}  // Switch images on hover
                                alt={destination.name}
                                className="w-full h-64 object-cover transition-all duration-500 ease-in-out cursor-pointer"  // Add transition for smooth change
                                onClick={() => handleImageClick(destination)}  // Handle click to display both images
                            />
                            <div className="p-6 flex flex-col items-stretch bg-orange-400 bg-opacity-30">
                                <div className="text-center">
                                    <span className="text-sm text-orange-600 font-medium">{destination.duration} days/</span>
                                    <span className="text-sm text-orange-600 font-medium">{destination.duration - 1} nights</span>
                                </div>
                                <div className="lg:h-40 md:h-36 mb-4 text-center">
                                    <h3 className="text-xl font-semibold mb-2 bg-orange-200">
                                        {destination.name}
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        {destination.description.length > 140 
                                            ? destination.description.slice(0, 140) + "..." 
                                            : destination.description
                                        }
                                    </p>
                                </div>
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="waguer2" className='font-semibold'>View {destination.name}</Button>
                                    </SheetTrigger>
                                    <SheetContent side="left">
                                        <SheetHeader>
                                            <SheetTitle>Trip: {destination.name}</SheetTitle>
                                        </SheetHeader>
                                        <TourDet id={destination.id} />
                                        <SheetFooter />
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal for displaying clicked destination images */}
            {clickedDestination && (
                <div className="fixed inset-0 z-50 bg-orange-100 bg-opacity-70 flex items-center justify-center">
                    <div className="relative bg-white bg-opacity-75 p-6">
                        <X   onClick={closeModal} 
                            className="absolute top-2 right-2 text-red-700 hover:border-red-700 hover:border-2 font-bold text-xl"></X>
                        
                        <div className="flex space-x-6 items-center p-6">
                            <div>
                                <img
                                    src={clickedDestination.map_image}
                                    alt="Map"
                                    className="h-auto w-80 object-contain"
                                />
                                <p className='text-center font-semibold text-orange-600 text-lg'>Tour Map</p>
                            </div>
                            <div>
                                <img
                                    src={clickedDestination.banner}
                                    alt="Banner"
                                    className="h-auto w-80 object-contain"
                                />
                                <p className='text-center font-semibold text-orange-600 text-lg'>Tour Flyer</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Destinations;
