// components/TourInfoForm.jsx
import React, { useState } from 'react';
import useApi from '@/services/api';
import { getToken } from '@/services/getToken';
import { toast } from 'react-toastify';

const TourInfoForm = ({ tourData, onSuccess }) => {
  const api = useApi();
  const [duration, setDuration] = useState(tourData.tour.duration);
  const [showDaysToDelete, setShowDaysToDelete] = useState(false);
  const [selectedDaysToDelete, setSelectedDaysToDelete] = useState([]);
console.log(tourData);
  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value);
    setDuration(newDuration);

    if (newDuration < tourData.tour.duration) {
      setShowDaysToDelete(true);
    } else {
      setShowDaysToDelete(false);
      setSelectedDaysToDelete([]);
    }
  };
  const handleDaySelection = (dayId) => {
    if (selectedDaysToDelete.includes(dayId)) {
      setSelectedDaysToDelete(prev => prev.filter(id => id !== dayId));
    } else {
      if (selectedDaysToDelete.length < (tourData.tour.duration - duration)) {
        setSelectedDaysToDelete(prev => [...prev, dayId]);
      } else {
        toast.warning('You have already selected the maximum number of days to delete');
      }
    }
  };

  const validateForm = () => {
    if (duration < tourData.tour.duration) {
      const requiredDeletions = tourData.tour.duration - duration;
      if (selectedDaysToDelete.length !== requiredDeletions) {
        toast.error(`Please select exactly ${requiredDeletions} day(s) to delete`);
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const formData = new FormData(e.target);
    formData.append('days_to_delete', JSON.stringify(selectedDaysToDelete));

    try {
      const token = getToken();
      const response = await api.post(`/api/tours/update-info/${tourData.tour.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        toast.success('Tour information updated successfully');
        setShowDaysToDelete(false);
        setSelectedDaysToDelete([]);
        onSuccess();
      }
    } catch (error) {
      toast.error('Error updating tour information');
    }
  };

  return (
    <section className="bg-orange-50 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-orange-800">Update Tour Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-orange-700">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={tourData.tour.name}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-orange-700">Departure City</label>
            <input
              type="text"
              name="depart_city"
              defaultValue={tourData.tour.depart_city}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-orange-700">End City</label>
            <input
              type="text"
              name="end_city"
              defaultValue={tourData.tour.end_city}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-orange-700">Duration (days)</label>
            <input
              type="number"
              name="duration"
              value={duration}
              onChange={handleDurationChange}
              min="1"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {showDaysToDelete && (
          <div className="mt-4 p-4 bg-orange-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-orange-800">
              Select {tourData.tour.duration - duration} day(s) to delete:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {tourData.days.map((day, index) => (
                <label key={day.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedDaysToDelete.includes(day.id)}
                    onChange={() => handleDaySelection(day.id)}
                    className="form-checkbox text-orange-500"
                  />
                  <span>Day {index + 1}: {day.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1 text-orange-700">Description</label>
          <textarea
            name="description"
            defaultValue={tourData.tour.description}
            className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-orange-700">Current Map Image</label>
            <img
              src={tourData.tour.map_image}
              alt="Map"
              className="w-full h-48 object-cover rounded"
            />
            <input type="file" name="map_image" className="mt-2" accept="image/*" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-orange-700">Current Banner</label>
            <img
              src={tourData.tour.banner}
              alt="Banner"
              className="w-full h-48 object-cover rounded"
            />
            <input type="file" name="banner" className="mt-2" accept="image/*" />
          </div>
        </div>

        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300"
        >
          Update Tour Information
        </button>
      </form>
    </section>
  );
};

export default TourInfoForm;