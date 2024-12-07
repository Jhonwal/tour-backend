import useApi from "@/services/api";
import { useEffect, useState } from "react";
import { Visitors } from "./Visitors";
import { getToken } from "@/services/getToken";

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
              console.log(err);
          }
      };
  
      fetchNumberOfTour();
  }, []);
  
  return (
    <div className="flex-1 p-10">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
        <div>
          <Visitors />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Number of tours</h2>
          <p>{numberOfTour}</p>
        </div>        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Number of tours</h2>
          <p>{numberOfTour}</p>
        </div>
      </div>
    </div>
  );
}

