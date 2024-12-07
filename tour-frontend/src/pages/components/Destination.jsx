import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../../services/api';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import TourDet from '../tour/TourDet';
import { Button } from '@/components/ui/button';

const Destinations = () => {
    const api = useApi();
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) {
        return (
            <div>
                <section id="destinations" className="mb-12 font-verdana">
                    <h2 className="text-3xl font-bold font-verdana text-center mb-8 text-white bg-orange-500 p-2">
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
                <h2 className="text-3xl font-bold font-verdana text-center mb-8 text-white bg-orange-500 p-2">
                    Featured Tours
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {destinations.map((destination) => (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden" key={destination.id}>
                            <img
                                src={destination.banner}
                                alt={destination.depart_city}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6 flex flex-col items-stretch bg-orange-400 bg-opacity-30">
                                <div className="text-center">
                                    <span className="text-sm text-orange-600 font-medium">{destination.duration} days/</span>
                                    <span className="text-sm text-orange-600 font-medium">{destination.duration - 1} nights</span>
                                </div>
                                <div className="lg:h-40 md:h-36 mb-4 text-center">
                                    <h3 className="text-xl font-semibold mb-2 bg-orange-200">
                                        {destination.depart_city}-{destination.end_city}
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        {destination.description.length > 140 
                                            ? destination.description.slice(0, 140) + "..." 
                                            : destination.description
                                        }
                                    </p>
                                </div>
                                <Link to={`/tour/${destination.id}`} className="waguer-btn self-end">
                                    Learn More
                                </Link>
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="waguer2">Learn More</Button>
                                    </SheetTrigger>
                                    <SheetContent side="left">
                                        <SheetHeader>
                                            <SheetTitle>Tripe: {destination.name}</SheetTitle>
                                        </SheetHeader>
                                            <TourDet id={destination.id}/>
                                        <SheetFooter>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Destinations;

