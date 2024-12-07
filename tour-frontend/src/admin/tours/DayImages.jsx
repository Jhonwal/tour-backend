import useApi from '@/services/api';
import React, { useEffect, useState } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader, Terminal } from 'lucide-react';
import Loading from '@/services/Loading';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { getToken } from '@/services/getToken';

const DayImages = () => {
  const api = useApi();
  const [days, setDays] = useState([]);
  const [picturesCount, setPicturesCount] = useState({});
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedDays, setSubmittedDays] = useState([]);
  const [totalDays, setTotalDays] = useState(0);
  const [cookies, setCookies] = useCookies(['activites', 'day_images']);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.activites) {
        navigate("/admin/tours/activites");
    };
    if(cookies.day_images){
        navigate("/admin/tours/destination");
    }
}, [cookies, navigate]);

  // Fetch the days of the latest tour
  useEffect(() => {
    const fetchLatestTourDays = async () => {
      try {
        const token = getToken();
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const tourResponse = await api.get("/api/last-tour", { headers });
        const tourData = tourResponse.data.tour;
        setDays(tourData.tour_days);
        setTotalDays(tourData.tour_days.length);

        // Load submitted days from localStorage
        const storedSubmittedDays = JSON.parse(localStorage.getItem("submittedDays")) || [];
        setSubmittedDays(storedSubmittedDays);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tour days:', err);
        setError('Failed to fetch tour days');
        setLoading(false);
      }
    };

    fetchLatestTourDays();
  }, []);

  // Handle input change for picture count
  const handleInputChange = (dayId, value) => {
    setPicturesCount({
      ...picturesCount,
      [dayId]: value,
    });
  };

  // Handle file input change
  const handleFileChange = (dayId, index, event) => {
    const newFiles = { ...files };
    if (!newFiles[dayId]) {
      newFiles[dayId] = [];
    }
    newFiles[dayId][index] = event.target.files[0];
    setFiles(newFiles);
  };

  // Handle form submission for each day
  const handleSubmit = async (e, dayId) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setError('');

    try {
      const formData = new FormData();
      formData.append("day_id", dayId);
      formData.append("picture_count", picturesCount[dayId] || 0);

      // Append each file for the current day
      if (files[dayId]) {
        files[dayId].forEach((file, index) => {
          if (file) formData.append(`pictures[${index}]`, file);
        });
      }

      const token = getToken();

      const rep =  await api.post('/api/tour/latest-days/pictures', formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage(rep.data.message + dayId);
      
      // Update submitted days
      const updatedSubmittedDays = [...submittedDays, dayId];
      setSubmittedDays(updatedSubmittedDays);
      localStorage.setItem("submittedDays", JSON.stringify(updatedSubmittedDays));
      if (updatedSubmittedDays.length === totalDays) {
        const dateExpire = new Date();
        dateExpire.setDate(dateExpire.getDate() + 60);
        localStorage.removeItem('submittedDays');
        setCookies('day_images', 'true', { path: '/', expires: dateExpire});
        navigate("/admin/tours/destination");
      }
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (error) {
      console.error('Error submitting pictures:', error);
      setError('Failed to submit pictures');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-6 flex justify-between">
      <div className="flex-1">
        <div className='grid grid-cols-3'>
            <span className={`text-center place-content-center bg-orange-200 border border-orange-300 text-orange-600 rounded`}> <strong>step 2:</strong> tour days parte 2</span>
            <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">Tour days picture</h2>
            <span className={`text-center place-content-center bg-orange-200 border border-orange-300 text-orange-600 rounded-lg`}>
                {submittedDays.length} / {totalDays} Days Submitted
            </span>
        </div>

        {/* Success Message Alert */}
        {successMessage && (
          <Alert variant="success" className="mb-6">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="error">
            <Terminal className="mr-2" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Accordion type="single" collapsible>
          {days
            .filter((day) => !submittedDays.includes(day.id))  // Filter out already submitted days
            .map((day) => (
              <AccordionItem key={day.id} value={`day-${day.id}`}>
                <AccordionTrigger>
                  <span className="flex justify-between items-center">
                    <span className="text-orange-600 font-semibold">Day {day.number}</span>
                    <span>: {day.name}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <form onSubmit={(e) => handleSubmit(e, day.id)} className="bg-gray-50 p-6 rounded-lg shadow-md">
                    <div className="flex flex-col gap-4">
                      <label className="block text-lg font-medium text-gray-700">
                        How many pictures for this day?
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={picturesCount[day.id] || ''}
                        onChange={(e) => handleInputChange(day.id, e.target.value)}
                        placeholder="Enter number of pictures"
                      />

                      {/* Dynamically render file inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {[...Array(parseInt(picturesCount[day.id] || 0)).keys()].map((_, index) => (
                          <Input
                            key={index}
                            type="file"
                            onChange={(e) => handleFileChange(day.id, index, e)}
                          />
                        ))}
                      </div>

                      <Button
                        variant="waguer2"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Loader className="animate-spin" /> : 'Submit'}
                      </Button>
                    </div>
                  </form>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>

    </div>
  );
};

export default DayImages;
