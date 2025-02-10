import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash, Plus, Search, Eye, Edit } from 'lucide-react';
import useApi from '@/services/api';
import { getToken } from '@/services/getToken';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminFAQPanel = () => {
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [maxFaq, setMaxFaq] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const api = useApi();
  const token = getToken();
  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
    is_active: true,
    order: 0
  });

  const fetchFaqs = async () => {
    try {
      const { data } = await api.get('/api/faqs/all',{headers: {Authorization: `Bearer ${token}`}});
      setFaqs(data.faq);
      setMaxFaq(data.max+1);
    } catch (error) {
      toast.error('Failed to fetch FAQs');
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async () => {
    try {
      await api.post('/api/faqs', newFaq,{headers: {Authorization: `Bearer ${token}`}});
      fetchFaqs();
      setNewFaq({ question: '', answer: '', is_active: true, order: 0 });
      setShowAddForm(false);
      toast.success('FAQ created successfully');
    } catch (error) {
      toast.error('Failed to create FAQ');
    }
  };

  const handleUpdate = async (id, updatedFaq) => {
    try {
      await api.put(`/api/faqs/${id}`, updatedFaq,
        {
          headers: {
            Authorization: `Bearer ${token}`
            }
            }
      );
      fetchFaqs();
      setEditingFaq(null);
      toast.success('FAQ updated successfully');
    } catch (error) {
      toast.error('Failed to update FAQ');
    }
  };

  const handleDelete = async () => {
      try {
        await api.delete(`/api/faqs/${faqToDelete.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
              }
              }
        );
        fetchFaqs();
        setIsDeleteDialogOpen(false);
        toast.success('FAQ deleted successfully');
      } catch (error) {
        toast.error('Failed to delete FAQ');
      }
  };
  const openDeleteDialog = (faq) => {
    setFaqToDelete(faq);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4 flex-1 mr-4">
          <Search className="w-5 h-5 text-gray-500" />
          <Input
            type="search"
            variant='orange'
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <Button variant='waguer3' onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New FAQ
        </Button>
      </div>

      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <Card key={faq.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer.substring(0, 100)}...</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{faq.question}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <p>{faq.answer}</p>
                        <div className="mt-4 text-sm text-gray-500">
                          <p>Order: {faq.order}</p>
                          <p>Status: {faq.is_active ? 'Active' : 'Inactive'}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingFaq(faq)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => openDeleteDialog(faq)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add FAQ Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New FAQ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Question</Label>
              <Input
                variant='orange'
                value={newFaq.question}
                onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Answer</Label>
              <Textarea
                variant='orange'
                value={newFaq.answer}
                onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-4">
              <Label>Order</Label>
              <Input
                type="number"
                variant='orange'
                disabled
                value={maxFaq}
                onChange={(e) => setNewFaq({...newFaq, order: parseInt(e.target.value)})}
                className="w-24"
              />
              <div className="flex items-center gap-2">
                <Label>Active</Label>
                <Switch
                  checked={newFaq.is_active}
                  onCheckedChange={(checked) => setNewFaq({...newFaq, is_active: checked})}
                />
              </div>
            </div>
            <Button variant='waguer3' onClick={handleCreate}>Create FAQ</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit FAQ Dialog */}
      <Dialog open={!!editingFaq} onOpenChange={() => setEditingFaq(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
          </DialogHeader>
          {editingFaq && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  variant='orange'
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({...editingFaq, question: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea
                  variant='orange'
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({...editingFaq, answer: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label>Order</Label>
                <Input
                  variant='orange'
                  type="number"
                  disabled
                  value={editingFaq.order}
                  onChange={(e) => setEditingFaq({...editingFaq, order: parseInt(e.target.value)})}
                  className="w-24"
                />
                <div className="flex items-center gap-2">
                  <Label>Active</Label>
                  <Switch
                    checked={editingFaq.is_active}
                    onCheckedChange={(checked) => setEditingFaq({...editingFaq, is_active: checked})}
                  />
                </div>
              </div>
              <Button variant='waguer3' onClick={() => handleUpdate(editingFaq.id, editingFaq)}>
                Update FAQ
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-orange-900">
            Are you sure you want to delete this FAQ?
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

export default AdminFAQPanel;