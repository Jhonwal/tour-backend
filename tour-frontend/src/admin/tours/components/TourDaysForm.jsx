import React, { useState } from 'react';
import useApi from '@/services/api';
import { getToken } from '@/services/getToken';
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const TourDaysForm = ({ tourData, onSuccess }) => {
  const [activeDayTab, setActiveDayTab] = useState(0);
  const [newDayImagesCount, setNewDayImagesCount] = useState({});
  const [editingHotel, setEditingHotel] = useState(null);
  const [isActivitiesDialogOpen, setIsActivitiesDialogOpen] = useState(false);
  const [activities, setActivities] = useState([]); // State to store all activities
  const [selectedActivities, setSelectedActivities] = useState([]); 
  const api = useApi();

  const parseHotels = (hotelsString) => {
    try {
      return JSON.parse(hotelsString);
    } catch (error) {
      return [];
    }
  };

    // Fetch activities when the dialog is opened
    const fetchActivities = async (dayId) => {
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };
        const activitiesResponse = await api.get(`/api/activities/day/${dayId}`, { headers });
        setActivities(activitiesResponse.data || []);
        
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch activities');
      }
    };
  
    // Handle opening the activities dialog
    const handleOpenActivitiesDialog = async (dayId) => {
      await fetchActivities(dayId); 
      setIsActivitiesDialogOpen(true);
    };

    const handleActivitySelection = (activityId) => {
      setSelectedActivities((prev) =>
        prev.includes(activityId)
          ? prev.filter((id) => id !== activityId) // Deselect if already selected
          : [...prev, activityId] // Select if not already selected
      );
    };
    const handleAddActivities = async (dayId) => {
      try {
        const token = getToken();
        await api.post(
          `/api/tours/tour-days/${tourData.tour.id}/${dayId}/activities`,
          { activity_ids: selectedActivities },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success('Activities added successfully');
        setIsActivitiesDialogOpen(false); // Close the dialog
        setSelectedActivities([]); // Clear selected activities
        onSuccess(); // Refresh the data
      } catch (error) {
        console.error(error);
        toast.error('Failed to add activities');
      }
    };

  const handleSubmit = async (e, dayId) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const activeDay = tourData.days.find(day => day.id === dayId);
    if (activeDay) {
      const hotels = parseHotels(activeDay.hotels);
      formData.append('hotels', JSON.stringify(hotels));
    }

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

  const handleDeleteHotel = async (dayId, hotelIndex) => {
    try {
      const token = getToken();
       await api.delete(`/api/tours/tour-days/${dayId}/hotels/${hotelIndex}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
        toast.success('Hotel deleted successfully');
        onSuccess(); 
    } catch (error) {
      toast.error('Failed to delete hotel');
    }
  };
  const handleActivityDelete = async (id, dayId) =>{
    try {
      const token = getToken();
      await api.delete(`/api/tours/tour-days/${dayId}/activities/${id}`, {headers: {'Authorization': `Bearer ${token}`,},});
          toast.success('Activity deleted successfully');
          onSuccess();
    } catch (error) {
      toast.error('Failed to delete activity');
    }
  }

  const handleAddHotel = async (dayId) => {
    try {
      const token = getToken();
       await api.post(
        `/api/tours/tour-days/${dayId}/hotels`,
        { name: 'New Hotel', link: 'https://example.com' }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
        toast.success('Hotel added successfully');
        onSuccess();
    } catch (error) {
      toast.error('Failed to add hotel: ' + error.response?.data?.message || error.message);
    }
  };

  const handleUpdateHotel = async (dayId, hotelIndex, updatedHotel) => {
    try {
      const token = getToken();

      if (!updatedHotel.name || !updatedHotel.link) {
        toast.error('Name and link are required');
        return;
      }

       await api.put(
        `/api/tours/tour-days/${dayId}/hotels/${hotelIndex}`,
        updatedHotel,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
        toast.success('Hotel updated successfully');
        setEditingHotel(null);
        onSuccess(); 
    } catch (error) {
      toast.error('Failed to update hotel: ' + error.response?.data?.message || error.message);
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
        <div key={day.id + 'id'} className={`${activeDayTab === index ? 'block' : 'hidden'}`}>
          <form onSubmit={(e) => handleSubmit(e, day.id)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">Day Name</label>
                <Input
                  variant='orange'
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
              <Input
                variant='orange'
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
            <div className='grid lg:grid-cols-2 grid-cols-1 gap-2'>
              {Array.from({ length: newDayImagesCount[day.id] || 0 }).map((_, imgIndex) => (
                <div key={imgIndex}>
                  <Input
                    variant='orange'
                    type="file"
                    name={`new_images_${imgIndex}`}
                    className="w-full"
                    accept="image/*"
                    required
                  />
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-orange-700">Hotels</h3>
              <div className="space-y-2">
                {parseHotels(day.hotels).map((hotel, hotelIndex) => (
                  <div key={hotelIndex} className="flex space-x-2">
                    <Input
                      variant='orange'
                      type="text"
                      defaultValue={hotel.name}
                      onChange={(e) => {
                        const updatedHotel = { ...hotel, name: e.target.value };
                        setEditingHotel({ dayId: day.id, hotelIndex, updatedHotel });
                      }}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                      placeholder="Hotel Name"
                    />
                    <Input
                      variant='orange'
                      type="text"
                      defaultValue={hotel.link}
                      onChange={(e) => {
                        const updatedHotel = { ...hotel, link: e.target.value };
                        setEditingHotel({ dayId: day.id, hotelIndex, updatedHotel });
                      }}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                      placeholder="Hotel Link"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateHotel(day.id, hotelIndex, editingHotel?.updatedHotel)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteHotel(day.id, hotelIndex)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddHotel(day.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                >
                  Add Hotel
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-orange-700">Activities</h3>
              <div className="flex flex-wrap gap-2 rounded-b-md bg-opacity-35 p-2">
                {day.activities.map((activity) => (
                  <span
                    key={activity.id}
                    className="flex items-center px-3 py-1 bg-orange-200 text-orange-900 rounded-full"
                  >
                    {activity.activites.activity_name}
                    <button
                      type="button"
                      onClick={() => handleActivityDelete(activity.id, day.id)}
                      className="ml-2 text-red-500 hover:text-red-600"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <Button
                type="button"
                onClick={() => handleOpenActivitiesDialog(day.id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 mt-2"
              >
                Add New Activities
              </Button>
            </div>
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300"
            >
              Update Day Information
            </button>
          </form>
        </div>
      ))}
      {/* Dialog for adding new activities */}
      <Dialog open={isActivitiesDialogOpen} onOpenChange={setIsActivitiesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Activities</DialogTitle>
            <DialogDescription>Select activities to add to this day.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap space-x-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedActivities.includes(activity.id)}
                  onChange={() => handleActivitySelection(activity.id)}
                  className="appearance-none h-5 w-5 border-2 border-orange-600 rounded-md checked:bg-orange-600 checked:border-orange-600 checked:text-white flex items-center justify-center cursor-pointer"
                  />
                <span>{activity.activity_name}</span>
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={() => handleAddActivities(tourData.days[activeDayTab].id)}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300 mt-4"
          >
            Add Selected Activities
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default TourDaysForm;