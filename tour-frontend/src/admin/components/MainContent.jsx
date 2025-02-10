import useApi from "@/services/api";
import { useEffect, useState } from "react";
import { getToken } from "@/services/getToken";
import Analytics from "./Analytics";

export default function MainContent() {
  const api = useApi();
    const [numberOfTour, setNumberOfTour] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
      const fetchNumberOfTour = async () => {
          try {
              const token =  getToken();
              const response = await api.get('/api/tours/countOfTours', {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              });
              setNumberOfTour(response.data.count);
          } catch (err) {
              if (err.response && err.response.status === 401) {
                  setError("Authentication error: Unauthorized");
              } else {
                  setError("An unexpected error occurred");
              }
          }
      };
  
      fetchNumberOfTour();
  }, []);
  
  return (
    <Analytics/>
  );
}

