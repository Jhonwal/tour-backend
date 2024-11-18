import { useEffect, useState } from "react";
import { BadgeInfo, Loader, SquareX } from 'lucide-react';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import useApi from "@/services/api.js";
import Loading from "@/services/Loading";
import { Button } from "@/components/ui/button";

const TourDestination = () => {
    const [numDestinations, setNumDestinations] = useState(1);
    const navigate = useNavigate();
    const [destinations, setDestinations] = useState([{ city: "", nights: 0 }]);
    const [cookies, setCookie] = useCookies(["day_images", "destination"])
    const [tour_id, setTourId] = useState(null);
    const [maxNights, setMaxNights] = useState(0); // Initialize as 0 to ensure it's a number
    const api = useApi();
    const [message, setMessage] = useState(""); // State to handle submission message
    const [loading, setLoading] = useState(true);
    const [isSubmit, setIsSubmit] = useState(false);
    // Redirect if 'activities' cookie is missing
    useEffect(() => {
        if (!cookies.day_images) {
            navigate("/admin/tours/day-images");
        };
        if(cookies.destination){
            navigate("/admin/tours/prices");
        }
    }, [cookies, navigate]);

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
                setTourId(tourResponse.data.tour.id);
                setMaxNights(tourDays.length);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching max nights from DB:", error);
            }
        };

        fetchMaxNights();
    }, [api]);

    const handleNumDestinationsChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setNumDestinations(value);
        setDestinations(Array.from({ length: value }, () => ({ city: "", nights: 0 })));
    };

    const handleInputChange = (index, field, value) => {
        setDestinations((prevDestinations) => {
            const newDestinations = [...prevDestinations];
            newDestinations[index] = {
                ...newDestinations[index],
                [field]: field === "nights" ? Math.max(0, value) : value,
            };
            return newDestinations;
        });
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
        setIsSubmit(true);
        // Map all destinations for submission
        const validDestinations = destinations.map((dest) => ({
            name: dest.city || "", // Default to an empty string if the city is missing
            number_of_nights: dest.nights || 0, // Default to 0 if no nights are entered
            tour_id: tour_id,
        }));
        const dateExpire = new Date();
        dateExpire.setDate(dateExpire.getDate() + 60);
        console.log("Submitting Destinations:", validDestinations); // Debug log

        const token = localStorage.getItem("token");
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        try {
            const response = await api.post("/api/destinations/store", validDestinations, { headers });
            setMessage(response.data.message || "Destinations submitted successfully!");
            setIsSubmit(false);
            setCookie('destination', 'true', { path: '/', expires: dateExpire });
            navigate('/admin/tours/prices');
        } catch (error) {
            console.error("Error submitting destinations:", error);
            setMessage("Failed to submit destinations. Please try again.");
        }
    };
    const closeError = () => {
        setMessage('');
    };
    if (loading) {
        return <Loading />;
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <span className={`py-1 px-4 bg-orange-200 border border-orange-300 text-orange-600 rounded`}> <strong>step 3:</strong> tour destinations</span>
            <h1 className="text-2xl font-bold mb-4 text-orange-600 text-center">
                Add destinations to your trip
            </h1>
            {message && 
            <div
                className="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50"
                role="alert"
            >
                <BadgeInfo className="mr-3"/>
                <div className="text-sm font-medium">{message}</div>
                <SquareX
                    onClick={closeError}
                    className="ms-auto p-1.5 rounded-lg cursor-pointer"
                />
            </div>
            }

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
                        <h2 className="text-xl font-semibold text-orange-800">Destination {index + 1}</h2>
                        <label htmlFor={`city-${index}`} className="block text-gray-700">City:</label>
                        <input
                            type="text"
                            id={`city-${index}`}
                            value={destination.city}
                            onChange={(e) => handleInputChange(index, "city", e.target.value)}
                            placeholder="Enter city name"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        />

                        <label htmlFor={`nights-${index}`} className="block text-gray-700 mt-2">Number of Nights:</label>
                        <input
                            type="number"
                            id={`nights-${index}`}
                            value={destination.nights}
                            min={0}
                            max={getMaxNightsForInput(index)}
                            onChange={(e) => handleInputChange(index, "nights", parseInt(e.target.value, 10))}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        />
                    </div>
                ))}

                {!isSubmit ? (
                    <Button
                        type="submit"
                        variant={`waguer2`}
                        onClick={() => handleSubmit()}
                        className="mt-4"
                    >
                        Submit
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        disabled
                        variant={`waguer2`}
                        className="mt-4"
                    >
                        <Loader className={`animate-spin`}/> Submitted
                    </Button>
                )}
            </form>
        </div>
    );
};

export default TourDestination;
