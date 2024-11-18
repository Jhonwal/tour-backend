import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Visitors } from "../components/Visitors";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                <div className="flex justify-between items-center mb-2">
                    <Input type="text" className="md:w-2/4 sm:w-2/3 w-full mr-2" placeholder="search" variant="orange" />
                    <Link to="/admin/tours/new-tours">
                        <Button variant="waguer2">Create new tour</Button>
                    </Link>
                </div>
                <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4">
                    <Visitors /><Visitors /><Visitors />
                </div>
            </div>
        </>
    );
}
