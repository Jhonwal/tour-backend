import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import useApi from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getToken } from '@/services/getToken';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const api = useApi();
  const navigate = useNavigate();
  const token = getToken();

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/admin/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (data) => {
    try {
      await api.post('/api/admin/categories', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Category created successfully');
      fetchCategories();
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await api.put(`/api/admin/categories/${currentCategory.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Category updated successfully');
      fetchCategories();
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/admin/categories/${categoryToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Category deleted successfully');
      fetchCategories();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const openDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories Management</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant='waguer3' onClick={() => setCurrentCategory(null)}>
              <Plus className="mr-2" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentCategory ? 'Edit Category' : 'Create Category'}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm 
              initialData={currentCategory} 
              onSubmit={currentCategory ? handleUpdate : handleCreate}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input 
          variant="orange"
          placeholder="Search categories..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table className="rounded-lg">
        <TableHeader>
          <TableRow className="bg-orange-100">
            <TableHead className="text-orange-900">Name</TableHead>
            <TableHead className="text-orange-900">Description</TableHead>
            <TableHead className="text-orange-900">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories
            .filter(cat => 
              cat.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(category => (
              <TableRow key={category.id} className="hover:bg-orange-50">
                <TableCell className="font-medium text-orange-900">
                  {category.name}
                </TableCell>
                <TableCell className="text-orange-800">
                  {category.description}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-orange-900 hover:bg-orange-100"
                      onClick={() => navigate(`/admin/blogs/categories/${category.id}/posts`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-orange-900 hover:bg-orange-100"
                      onClick={() => {
                        setCurrentCategory(category);
                        setIsOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      className="hover:bg-orange-100"
                      onClick={() => openDeleteDialog(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-orange-900">
            Are you sure you want to delete the category "{categoryToDelete?.name}"? 
            <br />
            <strong>All posts under this category will also be deleted.</strong>
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CategoryForm = ({ initialData, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [color, setColor] = useState(initialData?.color || '#FF5733');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, color });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className='space-y-2'>
        <label className="text-orange-900">Name</label>
        <Input 
          variant="orange"
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div className='space-y-2'>
        <label className="text-orange-900">Description</label>
        <Textarea 
          variant="orange"
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
      </div>
      <Button type="submit" variant='waguer3'>
        {initialData ? 'Update' : 'Create'}
      </Button>
    </form>
  );
};

export default CategoriesManagement;