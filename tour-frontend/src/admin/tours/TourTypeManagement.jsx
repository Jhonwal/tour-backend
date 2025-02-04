import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Eye, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useApi from '@/services/api';
import { getToken } from '@/services/getToken';
import { useNavigate } from 'react-router-dom';
import Loading from '@/services/Loading';

const TourTypeManagement = () => {
  const [tourTypes, setTourTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTourTypes();
  }, []);

  const fetchTourTypes = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      const response = await api.get('/api/tour-types/type',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setTourTypes(response.data);
    } catch (error) {
      toast.error("Failed to fetch tour types");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading/>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-orange-800">Tour Types Management</h1>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
        >
          <PlusCircle className="h-5 w-5" />
          Add New Type
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tourTypes.map((type) => (
          <TourTypeCard
            key={type.id}
            type={type}
            onView={() => {
              navigate(`/admin/tours/tour-types/type/${type.id}`)
            }}
            onEdit={() => {
              setSelectedType(type);
              setIsEditOpen(true);
            }}
          />
        ))}
      </div>     
      <EditTourTypeDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        tourType={selectedType}
        onUpdate={fetchTourTypes}
      />

      <AddTourTypeDialog
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        onAdd={fetchTourTypes}
      />
    </div>
  );
};

const TourTypeCard = ({ type, onView, onEdit }) => {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-orange-800">{type.name}</CardTitle>
        <CardDescription>{type.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <img
          src={type.image}
          alt={type.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onView}
            className="flex items-center gap-1 px-3 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
          >
            <Eye className="h-4 w-4" />
            View
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-1 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

const EditTourTypeDialog = ({ isOpen, setIsOpen, tourType, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const api = useApi();

  useEffect(() => {
    if (tourType) {
      setFormData({
        name: tourType.name,
        description: tourType.description,
        image: null
      });
    }
  }, [tourType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    if (formData.image) {
      form.append('image', formData.image);
    }
    form.append('_method', 'PUT');

    try {
      const token = getToken();
      await api.post(`/api/tour-types/type/${tourType.id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setIsOpen(false);
      onUpdate();
      toast.success("Tour type updated successfully");
    } catch (error) {
      toast.error("Failed to update tour type");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-orange-800">Edit Tour Type</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-orange-800">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-orange-800">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-orange-800">Image</label>
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              className="w-full text-orange-600"
              accept="image/*"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Update Tour Type
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AddTourTypeDialog = ({ isOpen, setIsOpen, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const api = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('image', formData.image);

    try {
      const token = getToken();
      await api.post('/api/tour-types/type', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setIsOpen(false);
      setFormData({ name: '', description: '', image: null });
      onAdd();
      toast.success("Tour type added successfully");
    } catch (error) {
      toast.error("Failed to add tour type");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-orange-800">Add New Tour Type</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-orange-800">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-orange-800">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-orange-800">Image</label>
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              className="w-full text-orange-600"
              accept="image/*"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Tour Type
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TourTypeManagement;
