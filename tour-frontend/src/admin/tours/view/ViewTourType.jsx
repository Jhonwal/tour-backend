import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useApi from '@/services/api';
import { getToken } from '@/services/getToken';
import { Eye, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // Import useParams to get the ID from the URL
import { toast } from 'react-toastify';

const ViewTourType = () => {
  const { id } = useParams(); // Get the `id` from the URL params
  const [tourType, setTourType] = useState(null); // State to store the tour type details
  const [tours, setTours] = useState([]); // State to store the associated tours
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const api = useApi();

  useEffect(() => {
    if (id) {
      fetchTourTypeAndTours();
    }
  }, [id]);

  const fetchTourTypeAndTours = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      const tourTypeResponse = await api.get(`/api/tour-types/type/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTourType(tourTypeResponse.data);
      console.log(tourTypeResponse);

      // Fetch associated tours
      const toursResponse = await api.get(`/api/tour-types/type/${id}/tours`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTours(toursResponse.data);
    } catch (error) {
      toast.error('Failed to fetch tour type or tours');
    } finally {
      setIsLoading(false);
    }
  };

  if (!tourType) {
    return isLoading ? (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
      </div>
    ) : (
      <div className="text-center text-orange-800">Tour type not found.</div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-orange-800">{tourType.name}</h2>
        <p className="text-sm text-gray-600">{tourType.description}</p>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-4 text-orange-800">Associated Tours</h3>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tours.map((tour) => (
              <Card key={tour.id} className="relative">
                <CardHeader>
                  <CardTitle className="text-base text-orange-800">{tour.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-orange-600">Duration: {tour.duration} days</p>
                  <p className="text-sm text-orange-600">
                    From {tour.depart_city} to {tour.end_city}
                  </p>
                </CardContent>
                <div className="absolute top-4 right-4">
                  <Link to={`/admin/tours/${tour.id}`}>
                    <button
                      className="p-2 text-orange-600 hover:text-orange-800"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTourType;