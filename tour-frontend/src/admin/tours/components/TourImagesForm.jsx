// components/TourImagesForm.jsx
import React, { useState } from 'react';
import useApi from '@/services/api';
import { getToken } from '@/services/getToken';
import { toast } from 'react-toastify';

const TourImagesForm = ({ tourData, onSuccess }) => {
  const [newImagesCount, setNewImagesCount] = useState(0);
  const api = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const token = getToken();
      const response = await api.post(`/api/tours/update-images/${tourData.tour.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        toast.success('Tour images updated successfully');
        setNewImagesCount(0);
        onSuccess();
      }
    } catch (error) {
      toast.error('Error updating tour images');
    }
  };

  const handleImageDelete = async (imageId) => {
    try {
      const token = getToken();
      const response = await api.delete(`/api/tours/tour-images/${imageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        toast.success('Image deleted successfully');
        onSuccess();
      }
    } catch (error) {
      toast.error('Error deleting image');
    }
  };

  return (
    <section className="bg-orange-50 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-orange-800">Update Tour Images</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {tourData.images.map((image) => (
          <div key={image.id} className="relative">
            <img
              src={image.url}
              alt="Tour"
              className="w-full h-48 object-cover rounded"
            />
            <button
              onClick={() => handleImageDelete(image.id)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-orange-700">
            Number of new images to add
          </label>
          <input
            type="number"
            min="0"
            value={newImagesCount}
            onChange={(e) => setNewImagesCount(parseInt(e.target.value))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
          />
        </div>
        {Array.from({ length: newImagesCount }).map((_, index) => (
          <div key={index} className="grid grid-cols-2">
            <input
              type="file"
              name={`new_images_${index}`}
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
          Update Tour Images
        </button>
      </form>
    </section>
  );
};

export default TourImagesForm;