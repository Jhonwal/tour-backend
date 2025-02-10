import React, { useState } from 'react';
import useApi from '@/services/api';
import { getToken } from '@/services/getToken';
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const ServicesForm = ({ tourData, onSuccess }) => {
  const [activeServiceTab, setActiveServiceTab] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const api = useApi();

  const handleSubmit = async (e, serviceId) => {
    e.preventDefault();
    setIsUpdating(true);
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
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (serviceId) => {
    setIsDeleting(true);
    try {
      const token = getToken();
      const response = await api.delete(
        `/api/tours/delete-service/${tourData.tour.id}/${serviceId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success('Service deleted successfully');
        onSuccess();
      }
    } catch (error) {
      toast.error('Error deleting service');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    const formData = new FormData(e.target);
    try {
      const token = getToken();
      const response = await api.post(
        `/api/tours/add-service/${tourData.tour.id}`,
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
        toast.success('Service added successfully');
        setIsDialogOpen(false);
        onSuccess();
      }
    } catch (error) {
      toast.error('Error adding service');
    } finally {
      setIsAdding(false);
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="ml-4">
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>Fill out the form to add a new service.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">Service Type</label>
                <select
                  name="type"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                >
                  <option value="include">Include</option>
                  <option value="exclude">Exclude</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">Services Name</label>
                <Input 
                  variant='orange'
                  type="text"
                  name="services"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">Services Description</label>
                <Textarea 
                  variant='orange'
                  name="services_description"
                  className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300"
                disabled={isAdding}
              >
                {isAdding ? 'Adding...' : 'Add Service'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
              <Input 
                variant='orange'
                type="text"
                name="services"
                defaultValue={service.services}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-orange-700">Services Description</label>
              <Textarea 
                variant='orange'
                name="services_description"
                defaultValue={service.services_description}
                className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex space-x-4">
              <Button 
                type="submit" 
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300"
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Service'}
              </Button>
              <Button 
                type="button" 
                onClick={() => handleDelete(service.id)} 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Service'}
              </Button>
            </div>
          </form>
        </div>
      ))}
    </section>
  );
};

export default ServicesForm;