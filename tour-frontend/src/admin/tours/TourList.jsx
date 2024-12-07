import React, { useState, useEffect } from "react";
import useApi from "@/services/api";
import { Eye, Pen, Trash2 } from "lucide-react";
import { getToken } from "@/services/getToken";

const TourTable = () => {
  const [tours, setTours] = useState([]); // List of tours
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const api = useApi();

  // Fetch tours on component mount or when page changes
  useEffect(() => {
    fetchTours(currentPage);
  }, [currentPage]);

  const fetchTours = async (page) => {
    try {
      const token =  getToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await api.get(`/api/tours?page=${page}`, { headers });
      setTours(response.data.data); // Update tours data
      setTotalPages(response.data.last_page); // Set total pages
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  const deleteTour = async (id) => {
    try {
      const token =  getToken();
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await api.delete(`/api/tours/${id}`, { headers });
      fetchTours(currentPage); // Refresh after deletion
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 shadow-lg rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-orange-700 text-center font-verdana">Tour list</h1>

      {/* Tours Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-orange-200">
          <thead>
            <tr className="bg-orange-100">
              <th className="border border-orange-300 px-4 py-2 text-left">Name</th>
              <th className="border border-orange-300 px-4 py-2 text-left">Duration</th>
              <th className="border border-orange-300 px-4 py-2 text-left">Departure</th>
              <th className="border border-orange-300 px-4 py-2 text-left">End</th>
              <th className="border border-orange-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.length > 0 ? (
              tours.map((tour) => (
                <tr key={tour.id} className="hover:bg-orange-50">
                  <td className="border border-orange-300 px-4 py-2">{tour.name}</td>
                  <td className="border border-orange-300 px-4 py-2">{tour.duration}</td>
                  <td className="border border-orange-300 px-4 py-2">{tour.depart_city}</td>
                  <td className="border border-orange-300 px-4 py-2">{tour.end_city}</td>
                  <td className="border border-orange-300 px-4 py-2 text-center">
                      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 justify-center">
                          <button
                              className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 w-full sm:w-auto text-center"
                              onClick={() => console.log(`View: ${tour.id}`)}
                          >
                              <Eye/>
                          </button>
                          <button
                              className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 w-full sm:w-auto text-center"
                              onClick={() => console.log(`Edit: ${tour.id}`)}
                          >
                              <Pen/>
                          </button>
                          <button
                              className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 w-full sm:w-auto text-center"
                              onClick={() => deleteTour(tour.id)}
                          >
                              <Trash2/>
                          </button>
                      </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-orange-500">
                  No tours available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              currentPage === index + 1
                ? "bg-orange-500 text-white"
                : "bg-orange-200 text-orange-700 hover:bg-orange-300"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TourTable;
