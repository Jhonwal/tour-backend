// components/TourDaysForm.jsx
import React, { useState } from 'react';
import useApi from '@/services/api';
import { getToken } from '@/services/getToken';
import { toast } from 'react-toastify';

const TourDaysForm = ({ tourData, onSuccess }) => {
  const [activeDayTab, setActiveDayTab] = useState(0);
  const [newDayImagesCount, setNewDayImagesCount] = useState({});
  const api = useApi();

  const handleSubmit = async (e, dayId) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const token = getToken();
      const response = await api.post(
        `/api/tours/update-day/${tourData.tour.id}/${dayId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success('Tour day updated successfully');
        setNewDayImagesCount(prev => ({ ...prev, [dayId]: 0 }));
        onSuccess();
      }
    } catch (error) {
      toast.error('Error updating tour day');
    }
  };

  const handleDayImageDelete = async (imageId) => {
    try {
      const token = getToken();
      const response = await api.delete(`/api/tours/day-images/${imageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        toast.success('Day image deleted successfully');
        onSuccess();
      }
    } catch (error) {
      toast.error('Error deleting day image');
    }
  };

  return (
    <section className="bg-orange-50 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-orange-800">Update Tour Days</h2>
      <div className="flex space-x-4 flex-wrap space-y-2 mb-4">
        {tourData.days.map((day, index) => (
          <button
            key={day.id}
            onClick={() => setActiveDayTab(index)}
            className={`px-4 py-2 rounded ${
              activeDayTab === index
                ? 'bg-orange-500 text-white'
                : 'bg-white text-orange-500 hover:bg-orange-100'
            }`}
          >
            Day {index + 1}
          </button>
        ))}
      </div>
      {tourData.days.map((day, index) => (
        <div key={day.id} className={`${activeDayTab === index ? 'block' : 'hidden'}`}>
          <form onSubmit={(e) => handleSubmit(e, day.id)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">Day Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={day.name}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">Day Description</label>
                <textarea
                  name="description"
                  defaultValue={day.description}
                  className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {day.day_images.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.url}
                    alt="Day"
                    className="w-full h-48 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleDayImageDelete(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-orange-700">
                Number of new images to add
              </label>
              <input
                type="number"
                min="0"
                value={newDayImagesCount[day.id] || 0}
                onChange={(e) =>
                  setNewDayImagesCount({
                    ...newDayImagesCount,
                    [day.id]: parseInt(e.target.value),
                  })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
              />
            </div>
            {Array.from({ length: newDayImagesCount[day.id] || 0 }).map((_, imgIndex) => (
              <div key={imgIndex}>
                <input
                  type="file"
                  name={`new_images_${imgIndex}`}
                  className="w-full"
                  accept="image/*"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300"
            >
              Update Day Information
            </button>
          </form>
        </div>
      ))}
    </section>
  );
};

export default TourDaysForm;