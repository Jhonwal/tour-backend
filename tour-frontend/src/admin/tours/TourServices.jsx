import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "@/services/api.js";
import { useCookies } from "react-cookie";
import Loading from "@/services/Loading";

const TourServices = () => {
    const [numServices, setNumServices] = useState(1);
    const [services, setServices] = useState([{ service: "", description: "", type: "include" }]);
    const [cookies, setCookies, removeCookies] = useCookies(["messageTour", "prices","day_images", "destination", "tours", "activites"]);
    const [tourId, setTourId] = useState(null);
    const [message, setMessage] = useState("");
    const api = useApi();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)

    // Redirect if 'activities' cookie is missing
    useEffect(() => {
        if (!cookies.prices) {
            navigate("/admin/tours/prices");
        }
    }, [cookies, navigate]);
    useEffect(() => {
        const fetchTourID = async () => {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            try {
                const tourResponse = await api.get("/api/last-tour", { headers });
                setTourId(tourResponse.data.tour.id);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tour id from DB:", error);
            }
        };

        fetchTourID();
    }, [api]);
    const handleNumServicesChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setNumServices(value);
        setServices(Array.from({ length: value }, () => ({ service: "", description: "", type: "include" })));
    };

    const handleInputChange = (index, field, value) => {
        const updatedServices = [...services];
        updatedServices[index][field] = value;
        setServices(updatedServices);
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
        // Map all services for submission
        const validServices = services.map((srv) => ({
            services: srv.service || "",
            services_description: srv.description || "",
            type: srv.type,
            tour_id: tourId,
        }));

        console.log("Submitting Services:", validServices); // Debug log


        try {
            const dateExpire = new Date();
            dateExpire.setDate(dateExpire.getDate() + 60);

            const response = await api.post("/api/services/store", validServices, { headers });
            setMessage(response.data.message || "Services submitted successfully!");
            removeCookies("tours", { path: "/" });
            removeCookies("activites", { path: "/" });
            removeCookies("prices", { path: "/" });
            removeCookies("destination", { path: "/" });
            removeCookies("day_images", { path: "/" });
            localStorage.setItem('messageTour', "The new trip has been successfully added to the catalog! 🗂️ It's now live for users to explore.");
            navigate("/admin/tours")

        } catch (error) {
            console.error("Error submitting services:", error);
            setMessage("Failed to submit services. Please try again.");
        }
    };
    // setLoading(false);
    if (loading) {
        return <Loading />;
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-orange-600 text-center">
                Add Services to Your Tour
            </h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="numServices" className="block text-gray-700">
                        Number of Services:
                    </label>
                    <input
                        type="number"
                        id="numServices"
                        value={numServices}
                        onChange={handleNumServicesChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    />
                </div>

                {services.map((service, index) => (
                    <div key={index} className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Service {index + 1}</h2>

                        <label htmlFor={`service-${index}`} className="block text-gray-700">Service:</label>
                        <input
                            type="text"
                            id={`service-${index}`}
                            value={service.service}
                            onChange={(e) => handleInputChange(index, "service", e.target.value)}
                            placeholder="Enter service name"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        />

                        <label htmlFor={`description-${index}`} className="block text-gray-700">Description:</label>
                        <textarea
                            id={`description-${index}`}
                            value={service.description}
                            onChange={(e) => handleInputChange(index, "description", e.target.value)}
                            placeholder="Enter service description"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        />

                        <label htmlFor={`type-${index}`} className="block text-gray-700">Service Type:</label>
                        <select
                            id={`type-${index}`}
                            value={service.type}
                            onChange={(e) => handleInputChange(index, "type", e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        >
                            <option value="include">Include</option>
                            <option value="exclude">Exclude</option>
                        </select>
                    </div>
                ))}

                <button
                    type="submit"
                    className="w-full bg-orange-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                    Submit
                </button>
            </form>

            {message && <p className="mt-4 text-center text-red-600">{message}</p>}
        </div>
    );
};

export default TourServices;
