import React, { useEffect, useRef, useState } from 'react';
import useApi from '../../services/api';
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
import { BadgeAlert, X } from 'lucide-react';
import Loading from '@/services/Loading';
import { useParams } from 'react-router-dom';


const TourTypesList = () => {
    const api = useApi();
    const [destinations, setTours] = useState([]);
    const [type, setType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();  // Retrieve the type ID from the URL parameter
    const [hoveredId, setHoveredId] = useState(null);
    const [clickedDestination, setClickedDestination] = useState(null);
    const divRef = useRef(null);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await api.get(`/api/tours/type/${id}`);
                setTours(response.data.tours);
                setType(response.data.type);
                setLoading(false);
                console.log(response.data);
            } catch (err) {
                setError(err.message);
                console.log(err);
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    const handleImageClick = (destination) => {
        setClickedDestination(destination);
    };

    const closeModal = () => {
        setClickedDestination(null);
    };
    useEffect(() => {
        if (type?.image) {
            divRef.current?.style.setProperty(
                "background-image",
                `url(${type.image})`,
                "important"
            );
        }
    }, [type]);    
    if (loading) {
        return <Loading />;
    }
    if (error) {
        return <div className="text-center text-red-600">Error: {error}</div>;
    }
    if (destinations.length === 0) {
        return <div className="text-center min-h-[60vh] place-content-center place-items-center bg-yellow-200  text-gray-600">
           <div className='max-w-md bg-yellow-300 border-l-4 border-yellow-700 p-4 flex flex-wrap items-center'>
                <BadgeAlert className='mr-3'/>
                <p className='text-lg font-semibold text-orange-600'>No tours found for this type right now. it's coming soon! </p>
            </div>
        </div>;
    }

    return (
        <div ref={divRef} className="p-4 bg-cover bg-center bg-opacity-75">            
            <div className="max-w-6xl mx-auto bg-white bg-opacity-60 p-8">
                <section id="destinations" className="mb-12 font-verdana">
                    <h2 className="text-3xl font-bold font-verdana text-center text-white bg-orange-500 p-2">
                        {type.name}
                    </h2>
                    <div className="mb-6 bg-orange-200 bg-opacity-50 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 p-4">
                        <img
                            src={type.image}
                            alt={type.name}
                            className="w-full lg:max-w-md rounded-lg shadow-md"
                        />
                        <p className="text-center lg:text-left lg:ml-6 text-sm font-verdana font-semibold text-orange-900">
                            {type.description}
                        </p>
                    </div>

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
        </div>
    );
};

export default TourTypesList;
