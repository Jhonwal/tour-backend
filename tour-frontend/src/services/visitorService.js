import { useEffect, useState } from 'react';
import axios from "axios";
import useApi from "@/services/api.js";

const VisitorTracker = () => {
    const api = useApi();
    const [ip, setIp] = useState("");

    // Fetch the IP address when the component mounts
    useEffect(() => {
        api.post('api/delete/session'); // Assuming this clears a session
        axios.get("https://api.ipify.org?format=json")
            .then((response) => {
                setIp(response.data.ip);
            })
            .catch((error) => {
                console.error("Error fetching IP address:", error);
            });
    }, []);

    useEffect(() => {
        const checkVisitor = async () => {
            // Check localStorage only
            const visited = localStorage.getItem('visited');

            if (!visited && ip) { // Only proceed if no record in localStorage
                try {
                    const response = await axios.get(`https://api.iplocation.net/?ip=${ip}`);
                    const country = response.data.country_name;

                    // Set localStorage to mark the user as visited
                    localStorage.setItem('visited', 'true');

                    // Only increment counter if a valid country is retrieved
                    if (country) {
                        await api.post(`/api/track-visitor`, { country });
                    } else {
                        console.error('No country data received from IP location service');
                    }
                } catch (error) {
                    console.error('Error tracking visitor:', error.message);
                }
            }
        };

        if (ip) checkVisitor(); // Only run if IP is fetched

    }, [ip]);  // Dependency on 'ip' to ensure this runs after IP is fetched

    return null;
};

export default VisitorTracker;
