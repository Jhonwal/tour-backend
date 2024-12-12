import { Input } from "@/components/ui/input";
import useApi from "@/services/api";
import { getToken } from "@/services/getToken";
import React, { useState, useEffect } from "react";

const MainBook = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [statusCounts, setStatusCounts] = useState({ pending: 0, confirmed: 0, canceled: 0, completed: 0 });
    const [filters, setFilters] = useState({
        status: "",
        search: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const api = useApi();

    // Fetch bookings and status counts
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = getToken();
                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                };

                const response = await api.get("/api/admin/bookings", { headers });
                const data = response.data.data;
                setBookings(data);
                setFilteredBookings(data);
                updateStatusCounts(data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, []);

    // Update status counts
    const updateStatusCounts = (data) => {
        const counts = {
            pending: data.filter(b => b.status === "pending").length,
            confirmed: data.filter(b => b.status === "confirmed").length,
            canceled: data.filter(b => b.status === "canceled").length,
            completed: data.filter(b => b.status === "completed").length,
        };
        setStatusCounts(counts);
    };

    // Filter bookings whenever filters change
    useEffect(() => {
        let filtered = bookings;

        // Apply search filter
        if (filters.search) {
            filtered = filtered.filter(
                b =>
                    b.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
                    b.reference_code.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Apply status filter
        if (filters.status) {
            filtered = filtered.filter(b => b.status === filters.status);
        }

        setFilteredBookings(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [filters, bookings]);

    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginateBookings = () => {
        const indexOfLastBooking = currentPage * perPage;
        const indexOfFirstBooking = indexOfLastBooking - perPage;
        return filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
    };

    const renderStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-orange-400";
            case "confirmed":
                return "bg-blue-500";
            case "canceled":
                return "bg-red-500";
            case "completed":
                return "bg-green-500";
            default:
                return "bg-gray-400";
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className={`card p-4 rounded-lg ${renderStatusColor("pending")}`}>
                    <h3 className="text-xl font-bold text-white">Pending</h3>
                    <p className="text-3xl text-white">{statusCounts.pending}</p>
                </div>
                <div className={`card p-4 rounded-lg ${renderStatusColor("confirmed")}`}>
                    <h3 className="text-xl font-bold text-white">Confirmed</h3>
                    <p className="text-3xl text-white">{statusCounts.confirmed}</p>
                </div>
                <div className={`card p-4 rounded-lg ${renderStatusColor("canceled")}`}>
                    <h3 className="text-xl font-bold text-white">Canceled</h3>
                    <p className="text-3xl text-white">{statusCounts.canceled}</p>
                </div>
                <div className={`card p-4 rounded-lg ${renderStatusColor("completed")}`}>
                    <h3 className="text-xl font-bold text-white">Completed</h3>
                    <p className="text-3xl text-white">{statusCounts.completed}</p>
                </div>
            </div>
            <div className="filters mb-6 p-4 border rounded-lg flex flex-wrap justify-between">
                <div className="mb-4 ">
                    <Input
                        type="text"
                        variant='orange'
                        placeholder="Search by name or reference code"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className='lg:min-w-80'
                    />
                </div>
                <div className="mb-4 flex">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="border p-2 rounded-md mr-2"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="canceled">Canceled</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Arrival Date</th>
                        <th className="p-2 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {paginateBookings().map((booking) => (
                        <tr key={booking.reference_code} className="border-t">
                            <td className="p-2">{booking.full_name}</td>
                            <td className="p-2">{booking.email}</td>
                            <td className="p-2">{booking.arrival_date}</td>
                            <td className="p-2">
                                <span className="px-2 py-1 rounded-lg text-white" style={{ backgroundColor: renderStatusColor(booking.status) }}>
                                    {booking.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination flex justify-center mt-4">
                {[...Array(Math.ceil(filteredBookings.length / perPage)).keys()].map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={() => handlePagination(pageNumber + 1)}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                            currentPage === pageNumber + 1 
                                ? "bg-orange-500 text-white"
                                : "bg-orange-200 text-orange-700 hover:bg-orange-300"
                        }`}
                    >
                        {pageNumber + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MainBook;
