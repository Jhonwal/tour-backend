import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useApi from '@/services/api';  // Assuming you have a custom hook for API calls
import Loading from '@/services/Loading';

const TourTypesList = () => {
    const api = useApi();
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();  // Retrieve the type ID from the URL parameter

    useEffect(() => {
        const fetchtours = async () => {
            try {
                const response = await api.get(`/api/tours/type/${id}`);
                console.log(response.data);  // For debugging purposes
                setTours(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchtours();
    }, [id]);  // Re-run effect when the ID changes


    // Handle loading state
    if (loading) {
        return <Loading />;
    }
    if (error) {
        return <div className="text-center text-red-600">Error: {error}</div>;
    }
    if (tours.length === 0) {
        return <div className="text-center my-auto text-gray-600">No tours found for this type.</div>;
    }

    // Render the tours
    return (
        <section id="tours" className="mb-12 font-verdana mt-2 max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-semibold text-center mb-8 text-orange-500 p-4 rounded-lg">
                Featured Tours
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tours.map((destination) => (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" key={destination.id}>
                        <div className="relative">
                            <img
                                src={destination.banner}
                                alt={destination.depart_city}
                                className="w-full h-48 object-cover transition-transform duration-300 transform hover:scale-105"
                            />
                            {/* Mirror Effect */}
                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white opacity-60"></div>
                        </div>
                        <div className="p-6 bg-gray-50">
                            <div className="text-center mb-4">
                                <span className="text-sm text-orange-600 font-medium">{destination.duration} days / </span>
                                <span className="text-sm text-orange-600 font-medium">{destination.duration - 1} nights</span>
                            </div>
                            <div className="text-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{destination.depart_city} - {destination.end_city}</h3>
                                <p className="text-gray-600 text-sm">{destination.description}</p>
                            </div>
                            <Link to={`/tour/${destination.id}`} className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200">
                                Learn More
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TourTypesList;
