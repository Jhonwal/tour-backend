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
import { Circle, Star, MessageCircle, Mail, User } from "lucide-react";
import { getToken } from "@/services/getToken";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [filteredTestimonials, setFilteredTestimonials] = useState([]);
    const [stateCounts, setStateCounts] = useState({ pending: 0, accept: 0, decline: 0 });
    const [selectedState, setSelectedState] = useState(null);
    const api = useApi();
    const [currentTestimonial, setCurrentTestimonial] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(10);

    useEffect(() => {
        const token = getToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        api.get("/api/testimonials/all", { headers })
            .then((response) => {
                setTestimonials(response.data);
                setFilteredTestimonials(response.data);
                const counts = {
                    pending: response.data.filter((t) => t.state === "pending").length,
                    accept: response.data.filter((t) => t.state === "accept").length,
                    decline: response.data.filter((t) => t.state === "decline").length,
                };
                setStateCounts(counts);
                setLoading(true);
            })
            .catch((error) => {
                toast.error("Failed to fetch testimonials");
            });
    }, []);

    useEffect(() => {
        if (selectedState) {
            setFilteredTestimonials(testimonials.filter((t) => t.state === selectedState));
            setCurrentPage(1);
        } else {
            setFilteredTestimonials(testimonials);
            setCurrentPage(1);
        }
    }, [selectedState, testimonials]);

    const handleStatusUpdate = (id, newState) => {
        const token = getToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        api.put(`/api/testimonials/${id}`, { state: newState }, { headers })
            .then((response) => {
                setTestimonials((prev) =>
                    prev.map((t) => (t.id === id ? { ...t, state: newState } : t))
                );
                toast.success(`Status updated to '${newState}' successfully`);
            })
            .catch((error) => {
                toast.error("Failed to update status");
            });
    };

    const handleRemove = (id) => {
        const token = getToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        api.delete(`/api/testimonials/${id}`, { headers })
            .then(() => {
                setTestimonials((prev) => prev.filter((t) => t.id !== id));
                toast.success("Testimonial deleted successfully");
                setCurrentTestimonial(null);
            })
            .catch((error) => {
                toast.error("Failed to delete testimonial");
            });
    };

    const stateColors = {
        pending: "text-yellow-400 bg-yellow-400",
        accept: "text-green-400 bg-green-400",
        decline: "text-red-400 bg-red-400",
    };

    const stateIcons = {
        pending: "⌛",
        accept: "✅",
        decline: "❌",
    };

    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginateTestimonials = () => {
        const indexOfLastTestimonial = currentPage * perPage;
        const indexOfFirstTestimonial = indexOfLastTestimonial - perPage;
        return filteredTestimonials.slice(indexOfFirstTestimonial, indexOfLastTestimonial);
    };

    if (!loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-orange-800 tracking-tight">
                    Testimonials Dashboard
                </h1>

                {/* Stats Cards */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {Object.entries(stateCounts).map(([state, count]) => (
                        <div
                            key={state}
                            onClick={() => setSelectedState(state === selectedState ? null : state)}
                            className={`
                                transform transition-all duration-300 hover:scale-105
                                cursor-pointer rounded-xl p-6 shadow-lg backdrop-blur-sm
                                ${state === "pending" ? "bg-yellow-50/90 hover:bg-yellow-100/90" : ""}
                                ${state === "accept" ? "bg-green-50/90 hover:bg-green-100/90" : ""}
                                ${state === "decline" ? "bg-red-50/90 hover:bg-red-100/90" : ""}
                                ${selectedState === state ? "ring-4 ring-orange-400" : ""}
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-6xl font-bold mb-2">
                                        {stateIcons[state]} {count}
                                    </p>
                                    <p className="text-xl font-semibold capitalize">
                                        {state} Testimonials
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedState && (
                    <div className="flex justify-end mb-4">
                        <Button
                            onClick={() => setSelectedState(null)}
                            className="bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                        >
                            Clear Filter
                        </Button>
                    </div>
                )}

                {/* Testimonials Table */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-orange-600 text-white">
                                    <th className="px-6 py-4 text-left">User</th>
                                    <th className="px-6 py-4 text-left">Contact</th>
                                    <th className="px-6 py-4 text-left">Feedback</th>
                                    <th className="px-6 py-4 text-center">Rating</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginateTestimonials().map((testimonial) => (
                                    <tr
                                        key={testimonial.id}
                                        className="border-b border-orange-100 hover:bg-orange-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <User className="h-5 w-5 text-orange-600 mr-2" />
                                                {testimonial.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <Mail className="h-5 w-5 text-orange-600 mr-2" />
                                                {testimonial.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <div className="flex items-center cursor-pointer">
                                                            <MessageCircle className="h-5 w-5 text-orange-600 mr-2" />
                                                            <span className="text-orange-600">View Message</span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-md p-4 bg-white shadow-xl rounded-lg">
                                                        <p className="text-gray-700">{testimonial.message}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center">
                                                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                                                <span>{testimonial.rating}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <Circle className={`h-4 w-4 ${stateColors[testimonial.state]}`} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        onClick={() => setCurrentTestimonial(testimonial)}
                                                        className="w-full bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                                                    >
                                                        Manage
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-2xl font-bold text-orange-800">
                                                            Update Status
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Choose a new status for this testimonial
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        {testimonial.state === "pending" && (
                                                            <>
                                                                <DialogClose className="w-full">
                                                                    <Button
                                                                        onClick={() => handleStatusUpdate(testimonial.id, "accept")}
                                                                        className="w-full bg-green-600 hover:bg-green-700"
                                                                    >
                                                                        Accept
                                                                    </Button>
                                                                </DialogClose>
                                                                <DialogClose className="w-full">
                                                                    <Button
                                                                        onClick={() => handleStatusUpdate(testimonial.id, "decline")}
                                                                        className="w-full bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Decline
                                                                    </Button>
                                                                </DialogClose>
                                                            </>
                                                        )}
                                                        {testimonial.state === "accept" && (
                                                            <>
                                                                <DialogClose className="w-full">
                                                                    <Button
                                                                        onClick={() => handleStatusUpdate(testimonial.id, "pending")}
                                                                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                                                                    >
                                                                        Set to Pending
                                                                    </Button>
                                                                </DialogClose>
                                                                <DialogClose className="w-full">
                                                                    <Button
                                                                        onClick={() => handleStatusUpdate(testimonial.id, "decline")}
                                                                        className="w-full bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Decline
                                                                    </Button>
                                                                </DialogClose>
                                                            </>
                                                        )}
                                                        {testimonial.state === "decline" && (
                                                            <>
                                                                <DialogClose className="w-full">
                                                                    <Button
                                                                        onClick={() => handleStatusUpdate(testimonial.id, "pending")}
                                                                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                                                                    >
                                                                        Set to Pending
                                                                    </Button>
                                                                </DialogClose>
                                                                <DialogClose className="w-full">
                                                                    <Button
                                                                        onClick={() => handleStatusUpdate(testimonial.id, "accept")}
                                                                        className="w-full bg-green-600 hover:bg-green-700"
                                                                    >
                                                                        Accept
                                                                    </Button>
                                                                </DialogClose>
                                                            </>
                                                        )}
                                                    </div>
                                                    <DialogFooter>
                                                        <Button
                                                            onClick={() => handleRemove(testimonial.id)}
                                                            className="w-full bg-red-600 hover:bg-red-700"
                                                        >
                                                            Delete Testimonial
                                                        </Button>
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
                {/* Pagination */}
                <div className="flex justify-center mt-6 gap-2">
                    {[...Array(Math.ceil(filteredTestimonials.length / perPage))].map((_, index) => (
                        <Button
                            key={index}
                            onClick={() => handlePagination(index + 1)}
                            className={`
                                px-4 py-2 rounded-lg transition-colors
                                ${currentPage === index + 1
                                    ? "bg-orange-600 text-white"
                                    : "bg-white text-orange-600 hover:bg-orange-100"}
                                shadow-sm hover:shadow-md
                            `}
                        >
                            {index + 1}
                        </Button>
                    ))}
                </div>

                {/* Toast Container */}
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    className="mt-16"
                />
            </div>
        </div>
    );
};

export default Testimonials;