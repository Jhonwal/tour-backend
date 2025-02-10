import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Eye, Search, User, Phone, Globe, Calendar, Users, Home, Utensils, Car, HeartHandshake, BadgeDollarSign } from 'lucide-react';
import useApi from '@/services/api';
import { getToken } from '@/services/getToken';

const TourRequestsManager = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({ subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const api = useApi();
  const token = getToken();

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const filtered = requests.filter(request =>
      request.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRequests(filtered);
  }, [searchQuery, requests]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/tour-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
      setFilteredRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch tour requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    try {
      await api.patch(`/api/tour-requests/${selectedRequest.id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      toast.success('Status updated successfully');
      fetchRequests();
      setIsStatusModalOpen(false);
      setNewStatus('');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSendEmail = async () => {
    if (!emailForm.subject.trim() || !emailForm.message.trim()) {
      toast.error('Please fill in all email fields');
      return;
    }

    try {
      await api.post(`/api/tour-requests/${selectedRequest.id}/email`, 
        emailForm,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      toast.success('Email sent successfully');
      setIsEmailModalOpen(false);
      setEmailForm({ subject: '', message: '' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to send email');
    }
  };

  const openWhatsApp = (phone) => {
    const formattedPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // Pagination logic
  const paginateRequests = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRequests.slice(startIndex, endIndex);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-orange-900">Tour Requests Management</h1>

      <div className="flex justify-between items-center">
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" />
          <Input
            type="text"
            placeholder="Search by name, email, or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant='orange'
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          />
        </div>
      </div>

      <div className="rounded-md border border-orange-200 bg-white">
        <Table>
          <TableHeader className="bg-orange-100">
            <TableRow>
              <TableHead className="text-orange-900">Full Name</TableHead>
              <TableHead className="text-orange-900">Email</TableHead>
              <TableHead className="text-orange-900">Country</TableHead>
              <TableHead className="text-orange-900">Arrival Date</TableHead>
              <TableHead className="text-orange-900">Status</TableHead>
              <TableHead className="text-center text-orange-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginateRequests().map((request) => (
              <TableRow key={request.id} className="hover:bg-orange-50">
                <TableCell>{request.full_name}</TableCell>
                <TableCell>{request.email}</TableCell>
                <TableCell>{request.country}</TableCell>
                <TableCell>{formatDate(request.arrival_date)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-600 hover:bg-orange-100"
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsViewModalOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-600 hover:bg-orange-100"
                      onClick={() => {
                        setSelectedRequest(request);
                        setNewStatus(request.status);
                        setIsStatusModalOpen(true);
                      }}
                    >
                      Status
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-600 hover:bg-orange-100"
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsEmailModalOpen(true);
                      }}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-600 hover:bg-orange-100"
                      onClick={() => openWhatsApp(request.phone)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center space-x-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="text-orange-600 hover:bg-orange-100"
        >
          Previous
        </Button>
        <span className="text-orange-900">{`Page ${currentPage} of ${totalPages}`}</span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="text-orange-600 hover:bg-orange-100"
        >
          Next
        </Button>
      </div>
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl bg-white h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-2xl font-bold text-orange-900 flex items-center gap-2">
              <Eye className="h-6 w-6" />
              Tour Request Details
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 p-4">
              <div className="space-y-4 bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-900 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2"><User className="h-4 w-4 text-orange-600" /> Name: <span className="font-medium">{selectedRequest.full_name}</span></p>
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-orange-600" /> Email: <span className="font-medium">{selectedRequest.email}</span></p>
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-orange-600" /> Phone: <span className="font-medium">{selectedRequest.phone}</span></p>
                  <p className="flex items-center gap-2"><Globe className="h-4 w-4 text-orange-600" /> Country: <span className="font-medium">{selectedRequest.country}</span></p>
                </div>
              </div>

              <div className="space-y-4 bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Trip Details
                </h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2"><Users className="h-4 w-4 text-orange-600" /> Travelers: <span className="font-medium">{selectedRequest.travelers}</span></p>
                  <p className="flex items-center gap-2"><Users className="h-4 w-4 text-orange-600" /> Has Children: <span className="font-medium">{selectedRequest.has_children ? 'Yes' : 'No'}</span></p>
                  {selectedRequest.has_children && (
                    <>
                      <p className="flex items-center gap-2"><Users className="h-4 w-4 text-orange-600" /> Children Count: <span className="font-medium">{selectedRequest.children_count}</span></p>
                      <p className="flex items-center gap-2"><Users className="h-4 w-4 text-orange-600" /> Children Ages: <span className="font-medium">{selectedRequest.children_ages ? JSON.parse(selectedRequest.children_ages).join(', ') : 'N/A'}</span></p>
                    </>
                  )}
                  <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-orange-600" /> Duration: <span className="font-medium">{selectedRequest.duration} days</span></p>
                  <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-orange-600" /> Arrival: <span className="font-medium">{formatDate(selectedRequest.arrival_date)}</span></p>
                  <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-orange-600" /> Departure: <span className="font-medium">{formatDate(selectedRequest.departure_date)}</span></p>
                </div>
              </div>

              <div className="col-span-2 space-y-4 bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-900 flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5" />
                  Preferences & Requirements
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2"><Globe className="h-4 w-4 text-orange-600" /> Experience Types: <span className="font-medium">{selectedRequest.experience_types ? JSON.parse(selectedRequest.experience_types).join(', ') : 'N/A'}</span></p>
                    <p className="flex items-center gap-2"><Globe className="h-4 w-4 text-orange-600" /> Destinations: <span className="font-medium">{selectedRequest.destinations ? JSON.parse(selectedRequest.destinations).join(', ') : 'N/A'}</span></p>
                    <p className="flex items-center gap-2"><Home className="h-4 w-4 text-orange-600" /> Accommodation: <span className="font-medium">{selectedRequest.accommodation_type ? JSON.parse(selectedRequest.accommodation_type).join(', ') : 'N/A'}</span></p>
                    <p className="flex items-center gap-2"><BadgeDollarSign className="h-4 w-4 text-orange-600" /> Budget Range: <span className="font-medium">{selectedRequest.budget_range}</span></p>
                    {selectedRequest.custom_budget && (
                    <p className="flex items-center gap-2"><BadgeDollarSign className="h-4 w-4 text-orange-600" />Custom Budget: <span className="font-medium">{selectedRequest.custom_budget} $</span></p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2"><Car className="h-4 w-4 text-orange-600" /> Transportation: <span className="font-medium">{selectedRequest.transportation ? JSON.parse(selectedRequest.transportation).join(', ') : 'N/A'}</span></p>
                    <p className="flex items-center gap-2"><Utensils className="h-4 w-4 text-orange-600" /> Dietary Preferences: <span className="font-medium">{selectedRequest.dietary_preferences ? JSON.parse(selectedRequest.dietary_preferences).join(', ') : 'N/A'}</span></p>
                    <p className="flex items-center gap-2"><HeartHandshake className="h-4 w-4 text-orange-600" /> Additional Services: <span className="font-medium">{selectedRequest.additional_services ? JSON.parse(selectedRequest.additional_services).join(', ') : 'N/A'}</span></p>
                    <p className="flex items-center gap-2"><HeartHandshake className="h-4 w-4 text-orange-600" /> Additional Activities: <span className="font-medium">{selectedRequest.additional_activities ? JSON.parse(selectedRequest.additional_activities).join(', ') : 'N/A'}</span></p>
                  </div>
                </div>
                {selectedRequest.other_requests && (
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <p className="font-semibold text-orange-900">Other Requests:</p>
                    <p className="mt-2">{selectedRequest.other_requests}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="bg-orange-50">
          <DialogHeader>
            <DialogTitle className="text-orange-900">Update Request Status</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <Select
                value={newStatus}
                onValueChange={setNewStatus}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button 
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={handleStatusUpdate}
                >
                  Update Status
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Modal */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="bg-orange-50">
          <DialogHeader>
            <DialogTitle className="text-orange-900">Send Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Subject"
              value={emailForm.subject}
              onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
              className="bg-white"
              required
            />
            <Textarea
              placeholder="Message"
              value={emailForm.message}
              onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
              rows={6}
              className="bg-white"
              required
            />
          </div>
          <DialogFooter>
            <Button 
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={handleSendEmail}
            >
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <ToastContainer />
    </div>
  );
};

export default TourRequestsManager;
