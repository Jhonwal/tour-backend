import React, { useState, useEffect } from 'react';
import { Pencil, Trash, Plus, X, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import useApi from '@/services/api';
import { getToken } from '@/services/getToken';
import { toast } from 'react-toastify';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [tours, setTours] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    discount_value: '',
    start_date: '',
    end_date: '',
    tour_ids: []
  });
  const [searchTerm, setSearchTerm] = useState('');

  const api = useApi();
  const token = getToken();
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  useEffect(() => {
    fetchPromotions();
    fetchTours();
  }, []);

  useEffect(() => {
    if (selectedPromo && isEditOpen) {
      setFormData({
        title: selectedPromo.title,
        discount_value: selectedPromo.discount_value,
        start_date: selectedPromo.start_date,
        end_date: selectedPromo.end_date,
        tour_ids: selectedPromo.tours?.map(tour => tour.id) || []
      });
    }
  }, [selectedPromo, isEditOpen]);

  const fetchPromotions = async () => {
    try {
      const response = await api.get('/api/promotions', { headers });
      setPromotions(response.data);
    } catch (error) {
      toast.error('Failed to fetch promotions');
    }
  };

  const fetchTours = async () => {
    try {
      const response = await api.get('/api/tours', { headers });
      setTours(response.data.tours);
    } catch (error) {
      toast.error('Failed to fetch tours');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPromo) {
        await api.put(`/api/promotions/${selectedPromo.id}`, formData, { headers });
        toast.success('Promotion updated successfully');
      } else {
        await api.post('/api/promotions', formData, { headers });
        toast.success('Promotion created successfully');
      }
      setIsEditOpen(false);
      fetchPromotions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const deletePromotion = async () => {
    try {
      await api.delete(`/api/promotions/${selectedPromo.id}`, { headers });
      toast.success('Promotion deleted successfully');
      setIsDeleteOpen(false);
      fetchPromotions();
    } catch (error) {
      toast.error('Failed to delete promotion');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const tourId = parseInt(value);
      setFormData(prev => ({
        ...prev,
        tour_ids: e.target.checked
          ? [...prev.tour_ids, tourId]
          : prev.tour_ids.filter(id => id !== tourId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Filter promotions based on search term
  const filteredPromotions = promotions.filter(promo =>
    promo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Promotion Management
          </h1>
          <Button
            onClick={() => {
              setSelectedPromo(null);
              setFormData({
                title: '',
                discount_value: '',
                start_date: '',
                end_date: '',
                tour_ids: []
              });
              setIsEditOpen(true);
            }}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Plus size={18} className="mr-2" /> New Promotion
          </Button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search promotions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full md:w-1/2 lg:w-1/3 border-gray-200 focus:ring-2 focus:ring-orange-500 rounded-lg shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromotions.map((promo) => (
            <Card key={promo.id} className="transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-gray-50 to-gray-100">
                <CardTitle className="text-lg font-bold text-gray-800">{promo.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPromo(promo);
                      setIsViewOpen(true);
                    }}
                    className="hover:bg-orange-50 text-orange-600"
                  >
                    View
                  </Button>
                  {new Date(promo.end_date) > new Date() && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedPromo(promo);
                        setIsEditOpen(true);
                      }}
                      className="hover:bg-red-50 text-red-600"
                    >
                      <Pencil size={16} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPromo(promo);
                      setIsDeleteOpen(true);
                    }}
                    className="hover:bg-red-50 text-red-600"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                      {promo.discount_value}% OFF
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(promo.start_date).toLocaleDateString()} - 
                    {new Date(promo.end_date).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl max-h-[96vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {selectedPromo ? 'Edit Promotion' : 'New Promotion'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className='space-y-1'>
                  <Label htmlFor="title" className="text-gray-700">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div  className='space-y-1'>
                  <Label htmlFor="discount_value" className="text-gray-700">Discount Value (%)</Label>
                  <Input
                    id="discount_value"
                    name="discount_value"
                    type="number"
                    value={formData.discount_value}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date" className="text-gray-700">Start Date</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date" className="text-gray-700">End Date</Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700">Select Tours</Label>
                  <div className="mt-2 max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
                    {tours.map(tour => (
                      <label key={tour.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          value={tour.id}
                          checked={formData.tour_ids.includes(tour.id)}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-gray-700">{tour.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                {selectedPromo ? 'Update' : 'Create'} Promotion
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-red-600">Confirm Deletion</DialogTitle>
            </DialogHeader>
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">
                Are you sure you want to delete "{selectedPromo?.title}"? This action cannot be undone.
              </AlertDescription>
            </Alert>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={deletePromotion} className="bg-red-600 hover:bg-red-700">
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {selectedPromo?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-lg font-medium">
                  {selectedPromo?.discount_value}% Discount
                </span>
                <span className="text-gray-600">
                  {new Date(selectedPromo?.start_date).toLocaleDateString()} - 
                  {new Date(selectedPromo?.end_date).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Included Tours</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedPromo?.tours?.map(tour => (
                    <div key={tour.id} className="px-4 py-2 bg-gray-100 rounded-lg text-gray-800 shadow-sm">
                      {tour.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PromotionManagement;