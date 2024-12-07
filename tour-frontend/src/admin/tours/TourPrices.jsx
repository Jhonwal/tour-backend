import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import useApi from "@/services/api";
import Loading from "@/services/Loading";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { getToken } from "@/services/getToken";

const TourPrices = () => {
    const [lastTour, setLastTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [cookie, setCookie] = useCookies(["destination", "prices"]);
    const navigate = useNavigate();
    const api = useApi();
    const [isSubmit, setIsSubmit] = useState(false);


    const categories = ["3-stars", "4-stars", "4&5-stars", "5-stars"];
    const columns = ["2", "3-4", "5<n"];

    useEffect(() => {
        if (!cookie.destination) {
            navigate("/admin/tours/destination");
        }
        if (cookie.prices) {
            navigate("/admin/tours/services");
        }
    }, [cookie, navigate]);

    useEffect(() => {
        const fetchLastTour = async () => {
            const token =  getToken();
            if (!token) {
                console.error("No token found. Redirecting to login.");
                navigate("/login");
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            try {
                const response = await api.get("/api/last-tour", { headers });
                setLastTour(response.data.tour);
            } catch (error) {
                console.error("Error fetching last tour:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLastTour();
    }, [navigate]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        const dateExpire = new Date();
        dateExpire.setDate(dateExpire.getDate() + 60);
        // Validate the form
        const validationErrors = {};
        for (const field in formData) {
            if (!formData[field]) {
                validationErrors[field] = "This field is required.";
            }
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        const token =  getToken();
        if (!token) {
            console.error("No token found. Redirecting to login.");
            navigate("/login");
            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };


        try {
            const response = await api.post("/api/tour-prices", {
                ...formData,
                tour_id: lastTour?.id,
            },{headers});
            setIsSubmit(false);
            setFormData({});
            setErrors({});
            setCookie('prices', 'true', { path: '/', expires: dateExpire });
        } catch (error) {
            alert("An error occurred while saving the tour price.");
            console.error(error);
        }
    };

    if (loading || !lastTour) {
        return <Loading />;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-md">       
             <span className={`py-1 px-4 bg-orange-200 border border-orange-300 text-orange-600 rounded`}> <strong>step 4:</strong> tour prices</span>
            <h1 className="text-2xl font-bold mb-4 text-orange-700 text-center">Add prices to the  {lastTour.name} tour</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <table className="min-w-full table-auto border-collapse border border-orange-300">
                    <thead>
                        <tr>
                            <th className="border border-orange-300 px-4 py-2 bg-orange-100">Stars</th>
                            {columns.map((col) => (
                                <th key={col} className="border border-orange-300 px-4 py-2 bg-orange-500 text-white">
                                    {col} Persons
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category}>
                                <td className="border border-orange-300 bg-orange-500 text-white px-4 py-2 font-medium">{category}</td>
                                {columns.map((col) => {
                                    const fieldName = `${category}|${col}`;
                                    return (
                                        <td key={fieldName} className="border border-orange-300 px-4 py-2">
                                            <input
                                                type="number"
                                                step="0.10"
                                                required
                                                placeholder={`Price for ${category} | ${col} Persons`}
                                                name={fieldName}
                                                value={formData[fieldName] || ""}
                                                onChange={handleInputChange}
                                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                                                    errors[fieldName] ? "border-red-500" : "border-orange-300"
                                                } focus:ring-orange-500 focus:border-orange-500`}
                                            />
                                            {errors[fieldName] && (
                                                <span className="text-red-500 text-sm">{errors[fieldName]}</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Button
                    type="submit" // Change here to type="submit"
                    variant={`waguer2`}
                    disabled={isSubmit} // Disable while submitting
                    className="mt-4"
                >
                    {isSubmit ? (
                        <>
                            <Loader className={`animate-spin`} /> Submitted
                        </>
                    ) : (
                        'Submit'
                    )}
                </Button>
            </form>

        </div>
    );
};

export default TourPrices;
