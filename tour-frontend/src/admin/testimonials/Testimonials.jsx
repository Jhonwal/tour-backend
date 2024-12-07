import React, { useEffect, useState } from "react";
import useApi from "@/services/api";
import Loading from "@/services/Loading";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogClose,
  } from "@/components/ui/dialog";
import { Circle, PartyPopper } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getToken } from "@/services/getToken";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [stateCounts, setStateCounts] = useState({ pending: 0, accept: 0, decline: 0 });
  const [selectedState, setSelectedState] = useState(null); // State filter
  const api = useApi();
  const [currentTestimonial, setCurrentTestimonial] = useState(null);
  const [loding, setLoading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, message: "" }); // Alert state


  // Fetch testimonials from the backend
  useEffect(() => {
    const token =  getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    api.get("/api/testimonials/all", { headers }) // Replace with your actual API endpoint
      .then((response) => {
        setTestimonials(response.data);
        setFilteredTestimonials(response.data); // Initially show all testimonials

        // Calculate state counts
        const counts = {
          pending: response.data.filter((t) => t.state === "pending").length,
          accept: response.data.filter((t) => t.state === "accept").length,
          decline: response.data.filter((t) => t.state === "decline").length,
        };
        setStateCounts(counts);
        setLoading(true);
      })
      .catch((error) => console.error("Error fetching testimonials:", error));
  }, []);

  // Filter testimonials based on selectedState
  useEffect(() => {
    if (selectedState) {
      setFilteredTestimonials(testimonials.filter((t) => t.state === selectedState));
    } else {
      setFilteredTestimonials(testimonials);
    }
  }, [selectedState, testimonials]);

  const handleStatusUpdate = (id, newState) => {
    const token =  getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    api.put(`/api/testimonials/${id}`, { state: newState }, { headers })
      .then((response) => {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, state: newState } : t))
        );
        setAlert({ visible: true, message: `Status updated to '${newState}' successfully.` });
      })
      .catch((error) => console.error("Error updating status:", error));
  };

  const handleRemove = (id) => {
    const token =  getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    api
      .delete(`/api/testimonials/${id}`, { headers })
      .then(() => {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        setAlert({ visible: true, message: `Testimonial deleted successfully.` });
        setCurrentTestimonial(null); // Close dialog
        hideAlertAfterTimeout();
      })
      .catch((error) => console.error("Error deleting testimonial:", error));
  };

  const closeAlert = () => {
      setAlert({ visible: false, message: '' });
  };
  // State color mapping
  const stateColors = {
    pending: "text-yellow-400 bg-yellow-400",
    accept: "text-green-400 bg-green-400",
    decline: "text-red-400 bg-red-400",
  };
  if(!loding){
    return <Loading/>
  }
  return (
    <div className="p-6 relative" onClick={closeAlert}>
      {/* Alert */}
      {alert.visible && (
          <Alert variant="success" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-4 max-w-xl">
            <PartyPopper className="h-6 w-6 mr-2" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
      )}
      <h1 className="text-2xl font-bold mb-6 text-center text-orange-700">Testimonials</h1>

      {/* Filter Cards */}
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mb-6">
        {Object.entries(stateCounts).map(([state, count]) => (
          <div
            key={state}
            onClick={() => setSelectedState(state === selectedState ? null : state)} // Toggle filter
            className={`cursor-pointer group w-full h-44 flex flex-col justify-center items-center relative rounded-xl overflow-hidden shadow-md 
              ${state === "pending" ? "bg-yellow-100 text-yellow-500" : ""}
              ${state === "accept" ? "bg-green-100 text-green-500" : ""}
              ${state === "decline" ? "bg-red-100 text-red-500" : ""}
              ${selectedState === state ? "ring-4 ring-offset-2 ring-orange-400" : ""}`}
          >
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className={`absolute blur z-10 duration-500 group-hover:blur-none group-hover:scale-105 
                ${state === "pending" ? "fill-yellow-300" : ""}
                ${state === "accept" ? "fill-green-300" : ""}
                ${state === "decline" ? "fill-red-300" : ""}`}
            >
              <path
                transform="translate(100 100)"
                d="M39.5,-49.6C54.8,-43.2,73.2,-36.5,78.2,-24.6C83.2,-12.7,74.8,4.4,69,22.5C63.3,40.6,60.2,59.6,49.1,64.8C38.1,70,19,61.5,0.6,60.7C-17.9,59.9,-35.9,67,-47.2,61.9C-58.6,56.7,-63.4,39.5,-70,22.1C-76.6,4.7,-84.9,-12.8,-81.9,-28.1C-79,-43.3,-64.6,-56.3,-49.1,-62.5C-33.6,-68.8,-16.8,-68.3,-2.3,-65.1C12.1,-61.9,24.2,-55.9,39.5,-49.6Z"
              ></path>
            </svg>

            <div className="z-20 flex flex-col justify-center items-center">
              <span className="font-bold text-6xl ml-2">{count}</span>
              <p className="font-bold capitalize">{state}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-orange-100">
            <tr>
              <th className="border border-orange-300 px-4 py-2 text-left">Name</th>
              <th className="border border-orange-300 px-4 py-2 text-left">Email</th>
              <th className="border border-orange-300 px-4 py-2 text-left">Message</th>
              <th className="border border-orange-300 px-4 py-2 text-left">Rating</th>
              <th className="border border-orange-300 px-4 py-2 text-left">State</th>     
              <th className="border border-orange-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTestimonials.map((testimonial) => (
              <tr key={testimonial.id} className="odd:bg-white even:bg-gray-50 hover:bg-orange-50">
                  <td className="border border-orange-300 px-4 py-2">{testimonial.name}</td>
                  <td className="border border-orange-300 px-4 py-2">{testimonial.email}</td>
                  <td className="border border-orange-300 px-4 py-2">
                  <TooltipProvider>
                      <Tooltip>
                          <TooltipTrigger asChild>
                              <p>Show</p>
                          </TooltipTrigger>
                      <TooltipContent>
                          <div className="max-w-lg">
                              <h1 className="text-center text-xl font-semibold text-white bg-orange-300">Message</h1>
                              <p className="p-6">{testimonial.message}</p>
                          </div>
                      </TooltipContent>
                  </Tooltip>
              </TooltipProvider>
                  </td>
                  <td className="border border-orange-300 px-4 py-2">{testimonial.rating}</td>
                  <td className='border-orange-300 flex justify-center'>
                      <Circle className={`rounded-full text-center ${stateColors[testimonial.state]}`}/>
                  </td>
                  <td className="border border-orange-300 px-4 py-2">
                      <Dialog>
                          <DialogTrigger asChild>
                          <button
                              onClick={() => setCurrentTestimonial(testimonial)}
                              className="px-3 py-2 w-full text-white bg-orange-500 rounded-md hover:bg-orange-600"
                          >
                              Update Status
                          </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Update Status</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                Choose a new status for the testimonial.
                            </DialogDescription>
                            <div className="space-y-4">
                                {testimonial.state === "pending" && (
                                  <>
                                    <DialogClose className="w-full">
                                        <button
                                        onClick={() => handleStatusUpdate(testimonial.id, "accept")}
                                        className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                                        >
                                        Accept
                                        </button>
                                    </DialogClose>
                                    <DialogClose className="w-full">
                                        <button
                                        onClick={() => handleStatusUpdate(testimonial.id, "decline")}
                                        className="w-full px-4 py-2 text-white bg-red-300 rounded-md hover:bg-red-400"
                                        >
                                        Decline
                                        </button>
                                    </DialogClose>
                                  </>
                                )}
                                {testimonial.state === "accept" && (
                                    <>
                                      <DialogClose className="w-full">
                                          <button
                                              onClick={() => handleStatusUpdate(testimonial.id, "pending")}
                                              className="w-full px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                                                                      >
                                              Set to Pending
                                          </button>
                                      </DialogClose>
                                      <DialogClose className="w-full">
                                          <button
                                              onClick={() => handleStatusUpdate(testimonial.id, "decline")}
                                              className="w-full px-4 py-2 text-white bg-red-300 rounded-md hover:bg-red-400"
                                              >
                                              Decline
                                          </button>                                      
                                      </DialogClose>
                                    </>
                                )}
                                {testimonial.state === "decline" && (
                                    <>
                                      <DialogClose className="w-full">
                                          <button
                                              onClick={() => handleStatusUpdate(testimonial.id, "pending")}
                                              className="w-full px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                                                                      >
                                              Set to Pending
                                          </button>
                                      </DialogClose>
                                      <DialogClose className="w-full">
                                          <button
                                          onClick={() => handleStatusUpdate(testimonial.id, "accept")}
                                          className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                                          >
                                          Accept
                                          </button>
                                      </DialogClose>
                                    </>
                                )}
                            </div>
                            <DialogFooter>
                              <button
                                onClick={() => handleRemove(testimonial.id)}
                                className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                              >
                                  Remove this testimonila definitlly
                              </button>
                            </DialogFooter>
                          </DialogContent>
                      </Dialog>
                  </td>
              </tr>                      
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Testimonials;
