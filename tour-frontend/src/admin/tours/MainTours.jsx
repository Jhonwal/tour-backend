import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import TourList from "./TourList";
import { TourTypes } from "./TourTypes";
import TourTypesTable from "./TourTypesTable";

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
                <Alert variant="success" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-4 max-w-xl w-full flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <PartyPopper className="h-6 w-6 mr-2" />
                            <div>
                                <AlertTitle>Success!</AlertTitle>
                                <AlertDescription>{message}</AlertDescription>
                            </div>
                        </div>
                        <Button variant="danger" onClick={closeAlert}>
                            Close
                        </Button>
                    </div>
                </Alert>
            )}
            <div className="flex flex-col p-2">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
                    <Input 
                        type="text" 
                        className="w-full sm:w-2/3 md:w-2/4 xl:w-1/3 mr-2" 
                        placeholder="search" 
                        variant="orange" 
                    />
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <Link to="/admin/tours/new-tours" className="w-full sm:w-auto">
                            <Button variant="waguer2" className="w-full sm:w-auto">Create new tour</Button>
                        </Link>
                        
                        <Link to="/tour-types/create" className="w-full sm:w-auto">
                            <Button variant="waguer2" className="w-full sm:w-auto">Add New Tour Type</Button>
                        </Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 mb-2">
                    <div className="col-span-1">
                        <TourTypes/>
                    </div>
                    <div className="col-span-2">
                        <TourTypesTable/>
                    </div>
                </div>
                <div>
                    <TourList/>
                </div>
            </div>
        </>
    );
}


