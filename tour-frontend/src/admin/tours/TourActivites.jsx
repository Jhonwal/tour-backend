import { useEffect, useState } from "react";
import useApi from "@/services/api.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { BadgeInfo, Loader, PartyPopper, Terminal, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Loading from "@/services/Loading";
import {useCookies} from "react-cookie";

const TourActivities = () => {
    const api = useApi();
    const [tour, setTour] = useState({});
    const [tourDays, setTourDays] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedActivitiesByDay, setSelectedActivitiesByDay] = useState({});
    const [dayNames, setDayNames] = useState({});
    const [dayDescriptions, setDayDescriptions] = useState({})
    const [submittedDays, setSubmittedDays] = useState({});
    const [showWarning, setShowWarning] = useState(true);
    const [showAlert, setShowAlert] = useState(true);
    const [showAlert1, setShowAlert1] = useState(true);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate(); // Use navigate for programmatic navigation
    const [cookie, setCookie] = useCookies('activites')
    const [cookieTors] = useCookies('tours');
    // On component mount, load submitted days from localStorage
    useEffect(() => {

        if (cookie.activites){
            navigate('/admin/tours/destination')
        }
        if (!cookieTors.tours){
            navigate('/admin/tours/new-tours')
        }
        const storedSubmittedDays = localStorage.getItem("submittedDays");
        if (storedSubmittedDays) {
            setSubmittedDays(JSON.parse(storedSubmittedDays));
        }

        const warningDismissed = localStorage.getItem('warningDismissed');
        if (warningDismissed === 'true') {
            setShowWarning(false);
        }

        const fetchTourAndRelatedData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                };

                // Fetch the last tour
                const tourResponse = await api.get("/api/last-tour", { headers });
                const tourData = tourResponse.data.tour;
                const tourDaysData = tourData.tour_days;

                setTour(tourData || {});
                setTourDays(tourDaysData || []);

                // Fetch activities
                const activitiesResponse = await api.get("/api/activities", { headers });
                setActivities(activitiesResponse.data || []);

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setError(true);
                setMessage("Failed to fetch data. Please try again later.");
                setLoading(false);
            }
        };

        fetchTourAndRelatedData();
    }, []);

    const handleActivityClick = (dayId, activity) => {
        setSelectedActivitiesByDay((prevSelected) => {
            const currentActivities = prevSelected[dayId] || [];
            if (!currentActivities.some((a) => a.id === activity.id)) {
                return {
                    ...prevSelected,
                    [dayId]: [...currentActivities, activity],
                };
            }
            return prevSelected;
        });
    };

    const handleActivityRemove = (dayId, activity) => {
        setSelectedActivitiesByDay((prevSelected) => {
            const currentActivities = prevSelected[dayId] || [];
            const updatedActivities = currentActivities.filter((a) => a.id !== activity.id);
            return {
                ...prevSelected,
                [dayId]: updatedActivities,
            };
        });
    };

    const handleDayNameChange = (dayId, newName) => {
        setDayNames((prevNames) => ({
            ...prevNames,
            [dayId]: newName,
        }));
    };
    const handleDayDescriptionChange = (dayId, newDescription) => {
        setDayDescriptions((prevDescriptions) => ({
            ...prevDescriptions,
            [dayId]: newDescription,
        }));
    };
    const handleSubmitDay = async (dayId) => {
        try {
            setIsSubmit(true);
            setShowAlert(true);
            setShowAlert1(true);
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };
            const dayName = dayNames[dayId];
            const dayDescription = dayDescriptions[dayId];
            const selectedActivities = selectedActivitiesByDay[dayId] || [];

            const submissionData = {
                tour_id: tour.id,
                tour_day_id: dayId,
                name: dayName,
                description: dayDescription,
                activities: selectedActivities.map((activity) => activity.id),
            };

            await api.post("/api/submit-day", submissionData, { headers });

            const updatedSubmittedDays = {
                ...submittedDays,
                [dayId]: true,
            };
            setSubmittedDays(updatedSubmittedDays);

            // Store submitted days in localStorage
            localStorage.setItem("submittedDays", JSON.stringify(updatedSubmittedDays));

            setMessage('Your entries have been successfully added to the day ' + dayName + '.');
            setSuccess(true);
            setError(false);

            // If all days are submitted, navigate to another page
            const totalDays = tourDays.length;
            const submittedDaysCount = Object.keys(updatedSubmittedDays).length;
            if (submittedDaysCount === totalDays) {
                const dateExpire = new Date();
                dateExpire.setDate(dateExpire.getDate() + 60);
                localStorage.removeItem('submittedDays');
                setCookie('activites', 'true', { path: '/', expires: dateExpire});
                navigate('/admin/tours/destination'); // Redirect to another page
            }
            setIsSubmit(false);
        } catch (error) {
            console.error("Failed to submit day:", error);
            if (error.response && error.response.data) {
                setMessage(error.response.data.message || "Failed to submit day.");
            } else {
                setMessage("Failed to submit day.");
            }
            setIsSubmit(false);
            setError(true);
        } finally {
            setIsSubmit(false);
        }
    };

    useEffect(() => {
        if (success) {
            const hideTimer = setTimeout(() => {
                setShowAlert(false);
                setSuccess(false);
            }, 5000);

            return () => clearTimeout(hideTimer);
        }
        if (error) {
            const hideTimer = setTimeout(() => {
                setShowAlert1(false);
                setError(false);
            }, 5000);

            return () => clearTimeout(hideTimer);
        }
    }, [success, error]);

    const closeWarning = () => {
        setShowWarning(false);
        localStorage.setItem('warningDismissed', 'true');
    };

    // Calculate the number of submitted days
    const totalDays = tourDays.length;
    const submittedDaysCount = Object.keys(submittedDays).length;

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <div className={`flex justify-between lg:mt-0 lg:top-0 mt-10`}>
                <span className={`py-1 px-4 bg-orange-200 border border-orange-300 text-orange-600 rounded`}> <strong>step 2:</strong> tour days</span>
                <h1 className={`text-center text-orange-600 font-bold text-xl`}>
                    {tour.depart_city}-{tour.end_city} Tour
                </h1>
                <span className={`py-2 px-4 bg-orange-200 border border-orange-300 text-orange-600 rounded-lg`}>
                    {submittedDaysCount}/{totalDays} days submitted
                </span>
            </div>
            <div className={`mb-4 flex flex-col items-center`}>
                {showWarning && tourDays && tourDays.length > 0 && (
                    <Alert variant="warning">
                        <BadgeInfo className={`mr-2`}/>
                        <AlertTitle>Warning!</AlertTitle>
                        <AlertDescription>
                            - Click on the number of day you want to modify.
                        </AlertDescription>
                        <AlertDescription>
                            - Enter the name for the day in the provided input fields.
                        </AlertDescription>
                        <AlertDescription>
                            - Select any available activities for this day.
                        </AlertDescription>
                        <div className={`absolute top-2 right-2 `}>
                            <X className={`hover:text-red-600 cursor-pointer`} onClick={closeWarning}/>
                        </div>
                    </Alert>
                )}

                {showAlert && success && (
                    <Alert variant="success" className={`top-2 end-2 mr-2`}>
                        <PartyPopper className="h-4 w-4"/>
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>
                            {message}
                        </AlertDescription>
                    </Alert>
                )}
                {showAlert1 && error && (
                    <Alert variant="error" className={`top-2 end-2`}>
                        <Terminal className="h-4 w-4"/>
                        <AlertTitle>Error!</AlertTitle>
                        <AlertDescription>
                            {message}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
            {tourDays && tourDays.length > 0 ? (
                <Accordion type="single" collapsible>
                    {tourDays.map((tourDay) => {
                        const isSubmitted = submittedDays[tourDay.id];
                        const isWaguerName = tourDay.name;
                        if (isSubmitted || isWaguerName !== 'waguer') return null;

                        const selectedActivities = selectedActivitiesByDay[tourDay.id] || [];
                        const availableActivities = activities.filter(activity => !selectedActivities.some(a => a.id === activity.id));

                        return (
                            <AccordionItem key={tourDay.id} value={`day-${tourDay.id}`}>
                                <AccordionTrigger>
                                    <span className="flex gap-3 justify-between">
                                        <span className={`text-orange-600`}>day number</span>
                                        <span>{tourDay.number}</span>
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="p-6 bg-orange-50 rounded-md">
                                        <div className="flex gap-2 items-center mb-6">
                                            <Input
                                                value={dayNames[tourDay.id] || ""}
                                                onChange={(e) => handleDayNameChange(tourDay.id, e.target.value)}
                                                variant={`orange`}
                                                disabled={isSubmitted || isSubmit}
                                                placeholder={`Name for ${tourDay.number}`}
                                            />
                                        </div>
                                        <div className="flex gap-2 items-center mb-6">
                                            <textarea
                                                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-orange-500 focus-visible:ring-orange-500"
                                                value={dayDescriptions[tourDay.id] || ""}
                                                onChange={(e) => handleDayDescriptionChange(tourDay.id, e.target.value)}
                                                disabled={isSubmitted || isSubmit}
                                                placeholder={`Description for ${tourDay.number}`}
                                            ></textarea>
                                        </div>

                                        {selectedActivities.length > 0 && (
                                            <div className="mb-6">
                                                <h2 className="text-xl font-semibold p-2 text-center text-white rounded-t-md bg-orange-500">Selected
                                                    Activities</h2>
                                                <div
                                                    className="flex flex-wrap gap-2 bg-amber-200 rounded-b-md bg-opacity-35 p-2 ">
                                                    {selectedActivities.map((activity, index) => (
                                                        <span
                                                            key={index}
                                                            className="flex items-center px-3 py-1 bg-orange-200 text-orange-900 rounded-full"
                                                        >
                                                            {activity.activity_name}
                                                            <button
                                                                disabled={isSubmitted || isSubmit}
                                                                onClick={() => handleActivityRemove(tourDay.id, activity)}
                                                                className="ml-2 text-red-500 hover:text-red-600"
                                                            >
                                                                &times;
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {availableActivities.length > 0 && (
                                            <div>
                                                <h2 className="text-lg font-semibold mb-3 text-center text-white rounded-t-md bg-orange-500">Select
                                                    Activities</h2>
                                                <div className="flex flex-wrap gap-2">
                                                    {availableActivities.map((activity, index) => (
                                                        <button
                                                            disabled={isSubmitted || isSubmit}
                                                            key={index}
                                                            onClick={() => handleActivityClick(tourDay.id, activity)}
                                                            className="border border-orange-300 p-2 rounded-md hover:bg-orange-100 hover:ring-2 hover:ring-offset-2 hover:ring-orange-500"
                                                        >
                                                            {activity.activity_name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}


                                        {!isSubmit ? (
                                            <Button
                                                variant={`waguer2`}
                                                onClick={() => handleSubmitDay(tourDay.id)}
                                                className="mt-4"
                                            >
                                                Submit
                                            </Button>
                                        ) : (
                                            <Button
                                                disabled
                                                variant={`waguer2`}
                                                className="mt-4"
                                            >
                                                <Loader className={`animate-spin`}/> Submitted
                                            </Button>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            ) : (
                <Alert variant="warning" className={`top-6`}>
                    <BadgeInfo className={`mr-2`}/>
                    <AlertTitle>Warning!</AlertTitle>
                    <AlertDescription>
                        - No tour days available.
                    </AlertDescription>
                </Alert>
            )}
        </>
    );
};

export default TourActivities;
