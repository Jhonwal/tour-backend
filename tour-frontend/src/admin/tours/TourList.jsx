import React, { useState, useEffect } from "react";
import useApi from "@/services/api";
import { Eye, Pen, Trash2 } from "lucide-react"; // Import Trash2 icon
import { getToken } from "@/services/getToken";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <p className="text-lg text-gray-800 mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const TourTable = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [types, setTypes] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [tourToDelete, setTourToDelete] = useState(null);
  const api = useApi();

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filterType, tours]);

  const fetchTours = async () => {
    try {
      const token = getToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await api.get(`/api/tours`, { headers });
      setTours(response.data.tours);
      setFilteredTours(response.data.tours);
      setTypes(response.data.types);
    } catch (error) {
      toast.error("Error fetching tours:", error);
    }
  };

  const deleteTour = async (id) => {
    try {
      const token = getToken();
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await api.delete(`/api/tour/${id}`, { headers });
      fetchTours(); 
      setIsDialogOpen(false);
      setTourToDelete(null);
      toast.success("Tour and all related data deleted successfully");
    } catch (error) {
      toast.error("Error deleting tour:", error);
    }
  };

  const handleDeleteClick = (tourId) => {
    setTourToDelete(tourId); // Set the tour ID to delete
    setIsDialogOpen(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = () => {
    if (tourToDelete) {
      deleteTour(tourToDelete); // Delete the tour
      setIsDialogOpen(false); // Close the dialog
      setTourToDelete(null); // Reset the tour ID
    }
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false); // Close the dialog
    setTourToDelete(null); // Reset the tour ID
  };

  const applyFilters = () => {
    let filtered = tours;

    if (searchQuery) {
      filtered = filtered.filter((tour) =>
        tour.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType) {
      filtered = filtered.filter((tour) => tour.tour_type_id === parseInt(filterType));
    }

    setFilteredTours(filtered);
    setCurrentPage(1);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTours.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const ActionButton = ({ icon: Icon, to, color, hoverColor, onClick }) => (
    <Link to={to}>
      <button
        className={`
          group
          relative
          p-1
          rounded-full
          transition-all
          duration-300
          ease-in-out
          hover:shadow-lg
          ${color}
          ${hoverColor}
          transform
          hover:scale-110
        `}
        onClick={onClick}
      >
        <Icon className="w-5 h-5 text-white transition-transform duration-300 ease-in-out group-hover:rotate-12" />
        <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </button>
    </Link>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 shadow-lg rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-orange-700 text-center font-verdana">
        Tour list
      </h1>

      {/* Filters */}
      <div id="filters" className="flex flex-col justify-between sm:flex-row gap-4 mb-6">
        <Input
          type="text"
          variant="orange"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/2 px-3 py-2 border border-orange-300 rounded-md"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full sm:w-1/4 px-3 py-2 border rounded-md text-orange-700 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 border-orange-600"
        >
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

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
            {getPaginatedData().length > 0 ? (
              getPaginatedData().map((tour) => (
                <tr key={tour.id} className="hover:bg-orange-50">
                  <td className="border border-orange-300 px-4 py-2">{tour.name}</td>
                  <td className="border border-orange-300 px-4 py-2">{tour.duration}</td>
                  <td className="border border-orange-300 px-4 py-2">{tour.depart_city}</td>
                  <td className="border border-orange-300 px-4 py-2">{tour.end_city}</td>
                  <td className="border border-orange-300 px-4 py-2 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <ActionButton
                        icon={Eye}
                        to={`/admin/tours/${tour.id}`}
                        color="bg-orange-500"
                        hoverColor="hover:bg-orange-600"
                      />
                      <ActionButton
                        icon={Pen}
                        to={`/admin/tours/${tour.id}/update`}
                        color="bg-green-500"
                        hoverColor="hover:bg-green-600"
                      />
                      <ActionButton
                        icon={Trash2}
                        onClick={() => handleDeleteClick(tour.id)} // Trigger delete confirmation
                        color="bg-red-500"
                        hoverColor="hover:bg-red-600"
                      />
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

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this tour? This action cannot be undone."
      />
      <ToastContainer/>
    </div>
  );
};

export default TourTable;