import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useApi from '@/services/api';
import Loading from '@/services/Loading';
import { ArrowLeftFromLineIcon } from 'lucide-react';
import { getToken } from '@/services/getToken';
import TourInfoForm from './components/TourInfoForm';
import TourImagesForm from './components/TourImagesForm';
import TourDaysForm from './components/TourDaysForm';
import ServicesForm from './components/ServicesForm';
import DestinationsForm from './components/DestinationsForm';
import PricesForm from './components/PricesForm';

const UpdateTour = () => {
  const [tourData, setTourData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { tourId } = useParams();
  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    fetchTourData();
  }, [tourId]);

  const fetchTourData = async () => {
    try {
      const token = getToken();
      const response = await api.get(`/api/tours/update/${tourId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setTourData(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching tour data');
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!tourData) {
    return <div className="text-red-500">Error loading tour data</div>;
  }

  return (
    <div className="mx-auto space-y-8 p-6">
      <ArrowLeftFromLineIcon
        className="text-3xl text-orange-600 hover:text-orange-500 cursor-pointer"
        onClick={() => navigate(`/admin/tours/${tourId}`)}
      />
      
      <TourInfoForm tourData={tourData} onSuccess={fetchTourData} />
      <TourImagesForm tourData={tourData} onSuccess={fetchTourData} />
      <TourDaysForm tourData={tourData} onSuccess={fetchTourData} />
      <ServicesForm tourData={tourData} onSuccess={fetchTourData} />
      <DestinationsForm tourData={tourData} onSuccess={fetchTourData} />
      <PricesForm tourData={tourData} onSuccess={fetchTourData} />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocus={true}
        pauseOnHover={true}
      />
    </div>
  );
};

export default UpdateTour;