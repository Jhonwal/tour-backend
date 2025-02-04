import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListCheckIcon, PartyPopper, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TourList from "./TourList";

export default function MainTours() {
    const [message, setMessage] = useState(null);
    const [isAlertVisible, setAlertVisible] = useState(true);

    useEffect(() => {
        const storedMessage = localStorage.getItem("messageTour");
        if (storedMessage) {
            setMessage(storedMessage);
        } else {
            setMessage(null); // If there's no message, set it to null.
        }
    }, []); // Empty dependency array means this runs once on mount.

    const closeAlert = () => {
        setAlertVisible(false);
        localStorage.removeItem("messageTour"); // Remove the item after closing the alert.
    };

    return (
        <>
            {isAlertVisible && message && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Alert variant="success" className="max-w-md w-full bg-white shadow-2xl rounded-xl border-0">
                        <div className="p-6">
                            <div className="flex items-start space-x-4">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <PartyPopper className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <AlertTitle className="text-xl font-semibold text-gray-900">
                                        Success!
                                    </AlertTitle>
                                    <AlertDescription className="text-gray-600">
                                        {message}
                                    </AlertDescription>
                                </div>
                            </div>
                            <Button
                                onClick={closeAlert}
                                className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Close
                            </Button>
                        </div>
                    </Alert>
                </div>
            )}
            <div className="flex flex-col p-2">
                <div className="flex flex-col px-8 pt-8 sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link to="/admin/tours/tour_types/" className="w-full lg:min-w-96 sm:w-auto">
                        <Button variant="waguer2" className="w-full lg:min-w-96 sm:w-auto flex items-center justify-center gap-2">
                            <ListCheckIcon className="w-5 h-5" /> {/* Icon for "Manage the tour types" */}
                            Manage the tour types
                        </Button>
                    </Link>
                    <Link to="/admin/tours/new-tours" className="w-full lg:min-w-96 sm:w-auto">
                        <Button variant="waguer2" className="w-full lg:min-w-96 sm:w-auto flex items-center justify-center gap-2">
                            <PlusCircle className="w-5 h-5" /> {/* Icon for "Create new tour" */}
                            Create new tour
                        </Button>
                    </Link>
                </div>
                <div>
                    <TourList/>
                </div>
            </div>
        </>
    );
}


