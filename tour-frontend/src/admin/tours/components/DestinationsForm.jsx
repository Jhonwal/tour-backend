import React, { useState } from 'react';
import useApi from '@/services/api';
import { getToken } from '@/services/getToken';
import { toast } from 'react-toastify';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react'; // Import a spinner icon

const DestinationsForm = ({ tourData, onSuccess }) => {
  const api = useApi();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDestinationName, setNewDestinationName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false); // Loading state for updating destinations
  const [deletingDestinationId, setDeletingDestinationId] = useState(null); // Track which destination is being deleted
  const [isAdding, setIsAdding] = useState(false); // Loading state for adding a destination

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true); // Start loading

    const formData = new FormData(e.target);
    const destinations = tourData.destinations.map(dest => ({
      id: dest.id,
      name: formData.get(`destination_name_${dest.id}`),
      number_of_nights: parseInt(formData.get(`destination_nights_${dest.id}`))
    }));

    const totalNights = destinations.reduce((sum, dest) => sum + dest.number_of_nights, 0);
    if (totalNights !== tourData.tour.duration) {
      toast.error(`Total nights must equal ${tourData.tour.duration}`);
      setIsUpdating(false); // Stop loading
      return;
    }

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
    } finally {
      setIsUpdating(false); // Stop loading
    }
  };

  const handleDelete = async (destinationId) => {
    setDeletingDestinationId(destinationId); // Set the destination being deleted
    try {
      const token = getToken();
      const response = await api.delete(
        `/api/tours/delete-destination/${destinationId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      toast.success('Destination deleted successfully');
      onSuccess();
    } catch (error) {
      toast.error('Error deleting destination');
    } finally {
      setDeletingDestinationId(null); // Reset the deleting state
    }
  };

  const handleAddDestination = async (e) => {
    e.preventDefault();
    setIsAdding(true); // Start loading
  
    try {
      const token = getToken();
      const response = await api.post(
        `/api/tours/add-destination/${tourData.tour.id}`,
        {
          name: newDestinationName,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success('Destination added successfully');
        setIsDialogOpen(false);
        setNewDestinationName(''); 
        onSuccess(); // Call the success callback
      }
    } catch (error) {
      setIsDialogOpen(false);
      toast.error('Error adding destination');
    } finally {
      setIsDialogOpen(false);
      onSuccess();
      setIsAdding(false); // Stop loading
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
              <Input variant='orange'
                type="text"
                name={`destination_name_${destination.id}`}
                defaultValue={destination.name}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-orange-700">Number of Nights</label>
              <Input variant='orange'
                type="number"
                name={`destination_nights_${destination.id}`}
                defaultValue={destination.number_of_nights}
                min="0"
              />
            </div>
            <div className="md:col-span-2">
              <Button
                type="button"
                onClick={() => handleDelete(destination.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                disabled={deletingDestinationId === destination.id} // Disable only the selected destination's button
              >
                {deletingDestinationId === destination.id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Show spinner while deleting
                ) : (
                  'Delete Destination'
                )}
              </Button>
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center">
          <Button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300"
            disabled={isUpdating} // Disable button while updating
          >
            {isUpdating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Show spinner while loading
            ) : (
              'Update Destinations'
            )}
          </Button>
          <Button
            type='button'
            variant="outline"
            onClick={() => setIsDialogOpen(true)}
          >
            Add New Destination
          </Button>
        </div>
      </form>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Destination</DialogTitle>
            <DialogDescription>Fill out the form to add a new destination.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDestination} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-orange-700">Destination Name</label>
              <Input variant='orange'
                type="text"
                value={newDestinationName}
                onChange={(e) => setNewDestinationName(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              variant='waguer3'
              disabled={isAdding} // Disable button while adding
            >
              {isAdding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Show spinner while loading
              ) : (
                'Add Destination'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default DestinationsForm;