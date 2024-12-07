import { Button } from "@/components/ui/button";
import useApi from "@/services/api";
import { ArrowLeft, ArrowRight, Eye, Pen, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TourTypesTable = () => {
    const [tourTypes, setTourTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [totalPages, setTotalPages] = useState(1); // Track the total number of pages
    const api = useApi();

    // Fetch tour types data from the server with pagination
    const fetchTourTypes = (page = 1) => {
        api.get(`/api/tour-types/page?page=${page}`)
            .then(response => {
                setTourTypes(response.data.data); // Data for current page
                setTotalPages(response.data.last_page); // Total number of pages
            })
            .catch(error => console.error("Error fetching tour types:", error));
    };

    useEffect(() => {
        fetchTourTypes(currentPage);
    }, [currentPage]);

    // Handle delete
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this tour type?")) {
            api.delete(`/api/tour-types/${id}`)
                .then(response => {
                    setTourTypes(tourTypes.filter(tourType => tourType.id !== id));
                    alert("Tour type deleted successfully");
                })
                .catch(error => console.error("Error deleting tour type:", error));
        }
    };

    // Pagination handlers
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

return (
    <div className="mx-auto">
        <div className="overflow-x-auto"> {/* Make the table horizontally scrollable */}
            <table className="table-auto w-full border-collapse">
                <thead className="bg-orange-200 text-black">
                    <tr>
                        <th className="border px-4 py-2">Tour type</th>
                        <th className="border px-4 py-2">Number of tours</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tourTypes.map(tourType => (
                        <tr key={tourType.id}>
                            <td className="px-5 py-3 border-b border-orange-200 bg-white text-sm w-2/5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 w-10 h-10 hidden sm:table-cell">
                                        <img className="w-full h-full rounded-full"
                                            src={tourType.image}
                                            alt="" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {tourType.name}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="border px-4 py-2 space-x-2 border-b-orange-200">{tourType.tours_count}</td>
                            <td className="border px-4 py-2 space-x-2 border-b-orange-200">
                                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                                    <Link 
                                        to={`/admin/tour_types/${tourType.id}`} 
                                        className="text-center bg-blue-500 text-white py-1 px-2 rounded-md text-sm w-full sm:w-auto flex justify-center items-center"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </Link>
                                    <Link 
                                        to={`/admin/tour_types/${tourType.id}/edit`} 
                                        className="text-center bg-green-500 text-white py-1 px-2 rounded-md text-sm w-full sm:w-auto flex justify-center items-center"
                                    >
                                        <Pen className="w-5 h-5" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(tourType.id)}
                                        className="text-center bg-red-500 text-white py-1 px-2 rounded-md text-sm w-full sm:w-auto flex justify-center items-center"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    
        {/* Pagination Controls */}
        <div className="flex justify-between mx-4 mt-2 items-center">
            <Button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1} 
                className="rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:bg-orange-400 disabled:cursor-wait"
            >
                <ArrowLeft />
            </Button>
            <span className="self-center text-sm">Page {currentPage} of {totalPages}</span>
            <Button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages} 
                className="rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:bg-orange-400 disabled:cursor-wait"
            >
                <ArrowRight />
            </Button>
        </div>
    </div>
    
    );
};

export default TourTypesTable;
