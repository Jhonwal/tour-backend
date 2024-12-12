import React, { useState, useEffect } from "react";
import useApi from "@/services/api";
import { Eye, Pen, Trash2 } from "lucide-react";
import { getToken } from "@/services/getToken";
import { Input } from "@/components/ui/input";

const TourTable = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [types, setTypes] = useState([]);
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
      console.error("Error fetching tours:", error);
    }
  };

  const deleteTour = async (id) => {
    try {
      const token = getToken();
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await api.delete(`/api/tours/${id}`, { headers });
      fetchTours();
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
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

  return (
    <div className="max-w-6xl mx-auto p-6 shadow-lg rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-orange-700 text-center font-verdana">
        Tour list
      </h1>

      {/* Filters */}
      <div id="filters" className="flex flex-col justify-between sm:flex-row gap-4 mb-6">
        <Input
            type="text"
            variant='orange'
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
                    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 justify-center">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 w-full sm:w-auto text-center"
                        onClick={() => console.log(`View: ${tour.id}`)}
                      >
                        <Eye />
                      </button>
                      <button
                        className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 w-full sm:w-auto text-center"
                        onClick={() => console.log(`Edit: ${tour.id}`)}
                      >
                        <Pen />
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 w-full sm:w-auto text-center"
                        onClick={() => deleteTour(tour.id)}
                      >
                        <Trash2 />
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
