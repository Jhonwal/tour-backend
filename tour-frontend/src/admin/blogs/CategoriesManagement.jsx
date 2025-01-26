import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Search 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import useApi from '@/services/api';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const api = useApi();

  const fetchCategories = async () => {
    const response = await api.get('/api/admin/categories');
    setCategories(response.data.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (data) => {
    await api.post('/api/admin/categories', data);
    fetchCategories();
    setIsOpen(false);
  };

  const handleUpdate = async (data) => {
    await api.put(`/api/admin/categories/${currentCategory.id}`, data);
    fetchCategories();
    setIsOpen(false);
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/admin/categories/${id}`);
    fetchCategories();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories Management</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentCategory(null)}>
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
          placeholder="Search categories..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {categories
          .filter(cat => 
            cat.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(category => (
            <div 
              key={category.id} 
              className="flex justify-between items-center p-4 bg-white shadow rounded"
            >
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 mr-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
              </div>
              <div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="mr-2"
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
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
      </div>
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
      <div>
        <label>Name</label>
        <Input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Description</label>
        <Input 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
      </div>
      <div>
        <label>Color</label>
        <Input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)} 
        />
      </div>
      <Button type="submit">
        {initialData ? 'Update' : 'Create'}
      </Button>
    </form>
  );
};

export default CategoriesManagement;