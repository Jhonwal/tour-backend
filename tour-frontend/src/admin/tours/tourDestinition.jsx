import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import useApi from "@/services/api.js";

const TourDestination = () => {
    const [numDestinations, setNumDestinations] = useState(1);
    const navigate = useNavigate();
    const [destinations, setDestinations] = useState([{ city: '', nights: 0 }]);
    const [cities, setCities] = useState([]);
    const [cookies] = useCookies(['activites']);
    const [maxNights, setMaxNights] = useState(0); // Initialize as 0 to ensure it's a number
    const api = useApi();
    const [message, setMessage] = useState(''); // State to handle submission message

    // Redirect if 'activities' cookie is missing
    useEffect(() => {
        if (!cookies.activites) {
            navigate('/admin/tours/activities');
        }
    }, [cookies, navigate]);

    // Fetch Moroccan cities
    useEffect(() => {
        axios.get('https://api.example.com/moroccan-cities')
            .then(response => setCities(response.data))
            .catch(error => console.error('Error fetching cities:', error));
    }, []);

    // Fetch maximum nights allowed from the database
    useEffect(() => {
        const fetchMaxNights = async () => {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            try {
                const tourResponse = await api.get("/api/last-tour", { headers });
                const tourDays = tourResponse.data.tour?.tour_days || [];
                setMaxNights(tourDays.length);
            } catch (error) {
                console.error("Error fetching max nights from DB:", error);
            }
        };

        fetchMaxNights();
    }, [api]);

    const handleNumDestinationsChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setNumDestinations(value);
        setDestinations(Array.from({ length: value }, () => ({ city: '', nights: 0 })));
    };

    const handleInputChange = (index, field, value) => {
        const newDestinations = [...destinations];
        const numericValue = field === 'nights' ? Math.min(value, getMaxNightsForInput(index)) : value;

        newDestinations[index] = { ...newDestinations[index], [field]: numericValue };
        setDestinations(newDestinations);
    };

    // Calculate total nights across all destinations
    const totalNights = destinations.reduce((sum, dest) => sum + parseInt(dest.nights || 0, 10), 0);

    // Calculate max nights allowed for each input based on total nights and max nights from DB
    const getMaxNightsForInput = (index) => {
        return maxNights - totalNights + parseInt(destinations[index].nights || 0, 10);
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create an array of valid destinations
        const validDestinations = destinations.filter(dest => dest.city && dest.nights > 0);

        if (validDestinations.length === 0) {
            setMessage('Please fill in at least one destination with valid data.');
            return;
        }

        const token = localStorage.getItem("token");
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        try {
            const response = await api.post("/api/destinations", validDestinations, { headers });
            setMessage(response.data.message || 'Destinations submitted successfully!');
            // Optionally reset the form or redirect
            // resetForm();
        } catch (error) {
            console.error("Error submitting destinations:", error);
            setMessage("Failed to submit destinations. Please try again.");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-orange-600 text-center">
                Add destinations to your trip
            </h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="numDestinations" className="block text-gray-700">
                        Number of Destinations:
                    </label>
                    <input
                        type="number"
                        id="numDestinations"
                        value={numDestinations}
                        onChange={handleNumDestinationsChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    />
                </div>

                {destinations.map((destination, index) => (
                    <div key={index} className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Destination {index + 1}</h2>

                        <label htmlFor={`city-${index}`} className="block text-gray-700">City:</label>
                        <select
                            id={`city-${index}`}
                            value={destination.city}
                            onChange={(e) => handleInputChange(index, 'city', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        >
                            <option value="">Select a city</option>
                            {cities.map((city, i) => (
                                <option key={i} value={city}>{city}</option>
                            ))}
                        </select>

                        {/* Render nights input conditionally based on totalNights and maxNights */}
                        {(totalNights < maxNights || destination.nights > 0) && (
                            <div>
                                <label htmlFor={`nights-${index}`} className="block text-gray-700 mt-2">Number of Nights:</label>
                                <input
                                    type="number"
                                    id={`nights-${index}`}
                                    value={destination.nights}
                                    min={0}
                                    max={getMaxNightsForInput(index)}
                                    onChange={(e) => handleInputChange(index, 'nights', parseInt(e.target.value, 10))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                            </div>
                        )}
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={totalNights !== maxNights} // Disable the button if totalNights does not equal maxNights
                    className={`w-full ${totalNights === maxNights ? 'bg-orange-600' : 'bg-gray-400'} text-white px-4 py-2 rounded-md shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
                >
                    Submit
                </button>
            </form>
            {message && <p className="mt-4 text-center text-red-600">{message}</p>}
        </div>
    );
};

export default TourDestination;
