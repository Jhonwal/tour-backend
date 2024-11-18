import React, { useEffect, useState } from 'react';
import useApi from '@/services/api';
import { useParams } from 'react-router-dom';

const TourDetails = () => {
  const [tour, setTour] = useState(null);
  const api = useApi();
  const { id } = useParams(); // Get the params from the URL
  console.log(id);  // Check if the ID is being received correctly

  useEffect(() => {
    const fetchTour = async () => {
      try {
        // Await the response from the API call
        const response = await api.get(`/api/tour/${id}`);
        setTour(response.data);  // Set the tour data in state
        console.log(response.data);  // Log the API response
      } catch (error) {
        console.error('Error fetching tour details:', error);
      }
    };

    fetchTour();  // Call the async function to fetch data
  }, [id]);  // Dependency array, re-run effect if the id changes

  // Handle loading state
  if (!tour) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold font-verdana text-center text-orange-600">{tour.depart_city}-{tour.end_city}</h1>
      {/* Tour Overview */}
      <div className="bg-white flex items-center shadow-lg rounded-lg p-6 mb-8">
        <div className='w-1/2 sm:w-full'>
          <p className='text-lg text-orange-400'>Trip Overview:</p>
          <p className="mt-4 text-lg text-gray-600">{tour.description}</p>
        </div>
        <div className='w-1/2 sm:w-full'>
          <p className='text-lg text-orange-400'>Trip Overview:</p>
          <p className="mt-4 text-lg text-gray-600">{tour.description}</p>
        </div>
      </div>

      {/* Destinations */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Destinations</h2>
        <div className="space-y-4 mt-4">
          {tour.destinations?.map(destination => (
            <div key={destination.id} className="border-b border-gray-200 pb-4">
              <h3 className="text-xl font-semibold text-gray-700">{destination.name}</h3>
              <p className="text-gray-500">Nights: {destination.number_of_nights}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Services</h2>
        <div className="space-y-4 mt-4">
          {tour.services?.map(service => (
            <div key={service.id} className="border-b border-gray-200 pb-4">
              <h3 className="text-xl font-semibold text-gray-700">{service.services}</h3>
              <p className="text-gray-500">{service.services_description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tour Images */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Images</h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {tour.tourImages?.map(image => (
            <div key={image.id} className="w-full h-56 bg-gray-200 rounded-lg overflow-hidden">
              <img className="w-full h-full object-cover" src={image.url} alt="Tour" />
            </div>
          ))}
        </div>
      </div>

      {/* Tour Activities (Day by Day) */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800">Tour Itinerary</h2>
        <div className="space-y-6 mt-4">
          {Object.keys(tour.tourActivites || {}).map((day, index) => (
            <div key={index} className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold text-gray-700">Day {day}</h3>
              <ul className="space-y-4 mt-4">
                {tour.tourActivites[day]?.map(activity => (
                  <li key={activity.id} className="border-b border-gray-200 pb-4">
                    <h4 className="text-lg font-medium text-gray-700">{activity.activity_name}</h4>
                    <p className="text-gray-600">{activity.activity_description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default TourDetails;
