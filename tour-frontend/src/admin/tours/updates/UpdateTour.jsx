import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useApi from '@/services/api';
import Loading from '@/services/Loading';
import { ArrowLeftFromLineIcon } from 'lucide-react';

const UpdateTour = () => {
  const [tourData, setTourData] = useState(null);
  const [newImagesCount, setNewImagesCount] = useState(0);
  const [newDayImagesCount, setNewDayImagesCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeDayTab, setActiveDayTab] = useState(0); // State for active day tab
  const [activeServiceTab, setActiveServiceTab] = useState(0); // State for active service tab
  const { tourId } = useParams();
  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    fetchTourData();
  }, [tourId]);

  const fetchTourData = async () => {
    try {
      const response = await api.get(`/api/tours/update/${tourId}`);
      if (response.data.success) {
        setTourData(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching tour data');
      setLoading(false);
    }
  };

  const handleTourInfoSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const response = await api.post(`/api/tours/update/${tourId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        toast.success('Tour information updated successfully');
        fetchTourData();
      }
    } catch (error) {
      toast.error('Error updating tour information');
    }
  };

  const handleImageDelete = async (imageId) => {
    try {
      const response = await api.delete(`/api/tour-images/${imageId}`);
      if (response.data.success) {
        toast.success('Image deleted successfully');
        fetchTourData();
      }
    } catch (error) {
      toast.error('Error deleting image');
    }
  };

  const handleDayImageDelete = async (imageId) => {
    try {
      const response = await api.delete(`/api/day-images/${imageId}`);
      if (response.data.success) {
        toast.success('Day image deleted successfully');
        fetchTourData();
      }
    } catch (error) {
      toast.error('Error deleting day image');
    }
  };

  if (loading) {
    return <Loading/>;
  }

  if (!tourData) {
    return <div className="text-red-500">Error loading tour data</div>;
  }

  return (
    <div className="mx-auto space-y-8">
      {/* Tour Information Section */}
      <ArrowLeftFromLineIcon className="text-3xl text-orange-600 hover:text-orange-500 cursor-pointer" 
      onClick={() => navigate(`/admin/tours/${tourId}`)} />
      <section className="bg-orange-50 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-orange-800">Update Tour Information</h2>
        <form onSubmit={handleTourInfoSubmit} className="space-y-4">
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
                defaultValue={tourData.tour.duration}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
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
              <input type="file" name="map_image" className="mt-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-orange-700">Current Banner</label>
              <img
                src={tourData.tour.banner}
                alt="Banner"
                className="w-full h-48 object-cover rounded"
              />
              <input type="file" name="banner" className="mt-2" />
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

      {/* Tour Images Section */}
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
        <form onSubmit={handleTourInfoSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-orange-700">Number of new images to add</label>
            <input
              type="number"
              min="0"
              value={newImagesCount}
              onChange={(e) => setNewImagesCount(parseInt(e.target.value))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {Array.from({ length: newImagesCount }).map((_, index) => (
            <div key={index} 
              className='grid grid-cols-2'
            >
              <input
                type="file"
                name={`new_images_${index}`}
                className="w-full"
                accept="image/*"
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

      {/* Days Section with Tabs */}
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
            <form onSubmit={handleTourInfoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-700">Day Name</label>
                  <input
                    type="text"
                    name={`day_name_${day.id}`}
                    defaultValue={day.name}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-700">Day Description</label>
                  <textarea
                    name={`day_description_${day.id}`}
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
                      onClick={() => handleDayImageDelete(image.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">Number of new images to add</label>
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
                    name={`new_day_images_${day.id}_${imgIndex}`}
                    className="w-full"
                    accept="image/*"
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

      {/* Services Section with Tabs */}
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
            <form onSubmit={handleTourInfoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">Service Type</label>
                <select
                  name={`service_type_${service.id}`}
                  defaultValue={service.type}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                >
                  <option value="include">Include</option>
                  <option value="exclude">Exclude</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">Services name</label>
                <input
                  type="text"
                  name={`services_${service.id}`}
                  defaultValue={service.services}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-orange-700">Services Description</label>
                <textarea
                  name={`services_description_${service.id}`}
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

      {/* Tour Destinations Section */}
      <section className="bg-orange-50 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-orange-800">Update Tour Destinations</h2>
        <form onSubmit={handleTourInfoSubmit} className="space-y-4">
          {tourData.destinations.map((destination, index) => (
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

      {/* Tour Prices Section */}
      <section className="bg-orange-50 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-orange-800">Update Tour Prices</h2>
        <form onSubmit={handleTourInfoSubmit} className="space-y-4">
          {tourData.prices.map((price) => (
            <div key={price.id} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-700">3 Stars (2 People)</label>
                  <input
                    type="number"
                    name="3-stars|2"
                    defaultValue={price['3-stars|2']}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-700">4 Stars (2 People)</label>
                  <input
                    type="number"
                    name="4-stars|2"
                    defaultValue={price['4-stars|2']}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-700">4&5 Stars (2 People)</label>
                  <input
                    type="number"
                    name="4&5-stars|2"
                    defaultValue={price['4&5-stars|2']}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-700">5 Stars (2 People)</label>
                  <input
                    type="number"
                    name="5-stars|2"
                    defaultValue={price['5-stars|2']}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-700">3 Stars (3-4 People)</label>
                  <input
                    type="number"
                    name="3-stars|3-4"
                    defaultValue={price['3-stars|3-4']}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-700">4 Stars (3-4 People)</label>
                  <input
                    type="number"
                    name="4-stars|3-4"
                    defaultValue={price['4-stars|3-4']}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-700">4&5 Stars (3-4 People)</label>
                  <input
                    type="number"
                    name="4&5-stars|3-4"
                    defaultValue={price['4&5-stars|3-4']}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-700">5 Stars (3-4 People)</label>
                  <input
                    type="number"
                    name="5-stars|3-4"
                    defaultValue={price['5-stars|3-4']}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-700">3 Stars (5+ People)</label>
                  <input
                    type="number"
                    name="3-stars|5<n"
                    defaultValue={price['3-stars|5<n']}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-700">4 Stars (5+ People)</label>
                  <input
                    type="number"
                    name="4-stars|5<n"
                    defaultValue={price['4-stars|5<n']}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-700">4&5 Stars (5+ People)</label>
                  <input
                    type="number"
                    name="4&5-stars|5<n"
                    defaultValue={price['4&5-stars|5<n']}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-700">5 Stars (5+ People)</label>
                  <input
                    type="number"
                    name="5-stars|5<n"
                    defaultValue={price['5-stars|5<n']}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300"
          >
            Update Prices
          </button>
        </form>
      </section>
    </div>
  );
};

export default UpdateTour;