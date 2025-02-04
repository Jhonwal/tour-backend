// components/ServicesForm.jsx
import React, { useState } from 'react';
import useApi from '@/services/api';
import { getToken } from '@/services/getToken';
import { toast } from 'react-toastify';

const ServicesForm = ({ tourData, onSuccess }) => {
  const [activeServiceTab, setActiveServiceTab] = useState(0);
  const api = useApi();

  const handleSubmit = async (e, serviceId) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const token = getToken();
      const response = await api.post(
        `/api/tours/update-service/${tourData.tour.id}/${serviceId}`,
        {
          type: formData.get('type'),
          services: formData.get('services'),
          services_description: formData.get('services_description')
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success('Service updated successfully');
        onSuccess();
      }
    } catch (error) {
      toast.error('Error updating service');
    }
  };

  return (
    <section className="bg-orange-50 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-orange-800">Update Tour Services</h2>
      <div className="flex flex-wrap space-x-4 space-y-2 mb-4">
        {tourData.services.map((service, index) => (
          <button
            key={service.id}
            onClick={() => setActiveServiceTab(index)}
            className={`px-4 py-2 rounded ${
              activeServiceTab === index
                ? 'bg-orange-500 text-white'
                : 'bg-white text-orange-500 hover:bg-orange-100'
            }`}
          >
            Service {index + 1}
          </button>
        ))}
      </div>
      {tourData.services.map((service, index) => (
        <div key={service.id} className={`${activeServiceTab === index ? 'block' : 'hidden'}`}>
          <form onSubmit={(e) => handleSubmit(e, service.id)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-orange-700">Service Type</label>
              <select
                name="type"
                defaultValue={service.type}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
              >
                <option value="include">Include</option>
                <option value="exclude">Exclude</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-orange-700">Services Name</label>
              <input
                type="text"
                name="services"
                defaultValue={service.services}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-orange-700">Services Description</label>
              <textarea
                name="services_description"
                defaultValue={service.services_description}
                className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300"
            >
              Update Service
            </button>
          </form>
        </div>
      ))}
    </section>
  );
};

export default ServicesForm;