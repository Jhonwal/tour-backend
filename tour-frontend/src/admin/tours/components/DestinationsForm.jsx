// components/DestinationsForm.jsx
import React from 'react';
import useApi from '@/services/api';
import { getToken } from '@/services/getToken';
import { toast } from 'react-toastify';

const DestinationsForm = ({ tourData, onSuccess }) => {
  const api = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const destinations = tourData.destinations.map(dest => ({
      id: dest.id,
      name: formData.get(`destination_name_${dest.id}`),
      number_of_nights: parseInt(formData.get(`destination_nights_${dest.id}`))
    }));

    try {
      const token = getToken();
      const response = await api.post(
        `/api/tours/update-destinations/${tourData.tour.id}`,
        { destinations },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success('Destinations updated successfully');
        onSuccess();
      }
    } catch (error) {
      toast.error('Error updating destinations');
    }
  };

  return (
    <section className="bg-orange-50 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-orange-800">Update Tour Destinations</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {tourData.destinations.map((destination) => (
          <div key={destination.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-orange-700">Destination Name</label>
              <input
                type="text"
                name={`destination_name_${destination.id}`}
                defaultValue={destination.name}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-orange-700">Number of Nights</label>
              <input
                type="number"
                name={`destination_nights_${destination.id}`}
                defaultValue={destination.number_of_nights}
                min="0"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300"
        >
          Update Destinations
        </button>
      </form>
    </section>
  );
};

export default DestinationsForm;