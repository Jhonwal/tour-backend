import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
    Calendar, 
    Users, 
    Clock, 
    XCircle, 
    CheckCircle, 
    TrendingUp, 
    MoreVertical, 
    Eye, 
    Edit 
} from "lucide-react";
import useApi from "@/services/api";
import { getToken } from "@/services/getToken";

const MainBook = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [statusCounts, setStatusCounts] = useState({
        pending: 0,
        confirmed: 0,
        canceled: 0,
        completed: 0
    });
    const [filters, setFilters] = useState({
        status: "",
        search: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(10);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const api = useApi();

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

    const updateStatusCounts = (data) => {
        const counts = {
            pending: data.filter(b => b.status === "pending").length,
            confirmed: data.filter(b => b.status === "confirmed").length,
            canceled: data.filter(b => b.status === "canceled").length,
            completed: data.filter(b => b.status === "completed").length,
        };
        setStatusCounts(counts);
    };

    useEffect(() => {
        let filtered = bookings;
        if (filters.search) {
            filtered = filtered.filter(
                b =>
                    b.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
                    b.reference_code.toLowerCase().includes(filters.search.toLowerCase())
            );
        }
        if (filters.status) {
            filtered = filtered.filter(b => b.status === filters.status);
        }
        setFilteredBookings(filtered);
        setCurrentPage(1);
    }, [filters, bookings]);

    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginateBookings = () => {
        const indexOfLastBooking = currentPage * perPage;
        const indexOfFirstBooking = indexOfLastBooking - perPage;
        return filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            const token = getToken();
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            await api.put(`/api/admin/bookings/${bookingId}/status`, {
                status: newStatus
            }, { headers });

            // Refresh bookings after update
            const response = await api.get("/api/admin/bookings", { headers });
            const data = response.data.data;
            setBookings(data);
            setFilteredBookings(data);
            updateStatusCounts(data);
            
        } catch (error) {
            console.error("Error updating booking status:", error);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending":
                return <Clock className="w-4 h-4" />;
            case "confirmed":
                return <CheckCircle className="w-4 h-4" />;
            case "canceled":
                return <XCircle className="w-4 h-4" />;
            case "completed":
                return <Users className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const StatusCard = ({ title, count, icon: Icon, gradient }) => (
        <Card className={`relative overflow-hidden ${gradient} border-none transition-transform hover:scale-105`}>
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 translate-y-[-50%] rotate-45 opacity-20">
                <Icon className="w-full h-full text-white" />
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span className="capitalize">{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold text-white">{count}</p>
                <p className="text-sm text-white/80 mt-1">Total Bookings</p>
            </CardContent>
        </Card>
    );

    const getStatusBadge = (status) => {
        const variants = {
            pending: "bg-orange-100 text-orange-800 hover:bg-orange-200",
            confirmed: "bg-blue-100 text-blue-800 hover:bg-blue-200",
            canceled: "bg-red-100 text-red-800 hover:bg-red-200",
            completed: "bg-green-100 text-green-800 hover:bg-green-200"
        };

        return (
            <Badge className={`${variants[status]} flex items-center gap-1`}>
                {getStatusIcon(status)}
                <span className="capitalize">{status}</span>
            </Badge>
        );
    };

    const statusCards = [
        {
            title: "Pending",
            count: statusCounts.pending,
            icon: Clock,
            gradient: "bg-gradient-to-br from-yellow-400 to-yellow-600"
        },
        {
            title: "Confirmed",
            count: statusCounts.confirmed,
            icon: CheckCircle,
            gradient: "bg-gradient-to-br from-blue-500 to-blue-700"
        },
        {
            title: "Canceled",
            count: statusCounts.canceled,
            icon: XCircle,
            gradient: "bg-gradient-to-br from-red-600 to-red-800"
        },
        {
            title: "Completed",
            count: statusCounts.completed,
            icon: TrendingUp,
            gradient: "bg-gradient-to-br from-green-700 to-green-900"
        }
    ];

    const ViewDialog = ({ booking, isOpen, onClose }) => {
        if (!booking) return null;
        
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Booking Details</DialogTitle>
                        <DialogDescription>
                            Reference: {booking.reference_code}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">Guest Name</h4>
                                <p>{booking.full_name}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">Email</h4>
                                <p>{booking.email}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">Arrival Date</h4>
                                <p>{booking.arrival_date}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-gray-500">Status</h4>
                                <p>{getStatusBadge(booking.status)}</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    const UpdateStatusDialog = ({ booking, isOpen, onClose }) => {
        if (!booking) return null;

        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Booking Status</DialogTitle>
                        <DialogDescription>
                            Change status for booking: {booking.reference_code}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {["pending", "confirmed", "canceled", "completed"].map((status) => (
                                <Button
                                    key={status}
                                    variant={booking.status === status ? "default" : "outline"}
                                    className={`w-full capitalize ${booking.status === status ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                                    onClick={() => {
                                        handleStatusUpdate(booking.id, status);
                                        onClose();
                                    }}
                                >
                                    {status}
                                </Button>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <div className="container mx-auto p-6 space-y-6 bg-orange-50/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statusCards.map((card) => (
                    <StatusCard key={card.title} {...card} />
                ))}
            </div>

            <Card className="border-orange-100 shadow-lg">
                <CardHeader className="border-b border-orange-100">
                    <CardTitle className="text-2xl font-bold text-orange-800">Booking Management</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <Input
                            placeholder="Search by name or reference..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="md:w-96 border-orange-200 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <Select
                            value={filters.status}
                            onValueChange={(value) => setFilters({ ...filters, status: value })}
                        >
                            <SelectTrigger className="w-48 border-orange-200">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem >All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="canceled">Canceled</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {paginateBookings().length > 0 ? (
                        <div className="rounded-md border border-orange-100">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-orange-50">
                                        <TableHead className="text-orange-900">Name</TableHead>
                                        <TableHead className="text-orange-900">Email</TableHead>
                                        <TableHead className="text-orange-900">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Arrival Date
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-orange-900">Status</TableHead>
                                        <TableHead className="text-orange-900 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginateBookings().map((booking) => (
                                        <TableRow 
                                            key={booking.reference_code}
                                            className="hover:bg-orange-50/50 transition-colors"
                                        >
                                            <TableCell className="font-medium">{booking.full_name}</TableCell>
                                            <TableCell>{booking.email}</TableCell>
                                            <TableCell>{booking.arrival_date}</TableCell>
                                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedBooking(booking);
                                                                setIsViewDialogOpen(true);
                                                            }}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedBooking(booking);
                                                                setIsUpdateDialogOpen(true);
                                                            }}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            Update Status
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-orange-500">
                            No bookings available.
                        </div>
                    )}

                    <div className="flex justify-center gap-2 mt-6">
                    {[...Array(Math.ceil(filteredBookings.length / perPage))].map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => handlePagination(idx + 1)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === idx + 1
                                    ? "bg-orange-500 text-white"
                                    : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                            }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
                </CardContent>
            </Card>

            <ViewDialog 
                booking={selectedBooking}
                isOpen={isViewDialogOpen}
                onClose={() => {
                    setIsViewDialogOpen(false);
                    setSelectedBooking(null);
                }}
            />

            <UpdateStatusDialog 
                booking={selectedBooking}
                isOpen={isUpdateDialogOpen}
                onClose={() => {
                    setIsUpdateDialogOpen(false);
                    setSelectedBooking(null);
                }}
            />
        </div>
    );
};

export default MainBook;