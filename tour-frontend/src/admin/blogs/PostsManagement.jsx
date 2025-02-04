import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Loader2, Star, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useApi from '@/services/api';
import { getToken } from '@/services/getToken';
import Loading from '@/services/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Confirmation Dialog Component
const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          {title}
        </DialogTitle>
      </DialogHeader>
      <div className="text-sm text-gray-600">
        {message}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// Post Item Component
const PostItem = ({ post, onView, onEdit, onDelete, isSubmitting }) => (
  <Card>
    <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4">
      <div className="flex-grow space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{post.title}</h2>
          {post.is_featured && (
            <Badge variant="secondary">
              <Star className="w-3 h-3 mr-1 text-yellow-500" />
              Featured
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">{post.excerpt}</p>
        <div className="flex items-center text-xs text-gray-500 gap-2">
          <span className="flex items-center">
            <Eye className="w-3 h-3 mr-1" /> {post.views}
          </span>
          <span className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}
          </span>
        </div>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onView}
          className="flex-1 sm:flex-none"
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onEdit}
          className="flex-1 sm:flex-none"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onDelete}
          disabled={isSubmitting}
          className="flex-1 sm:flex-none"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
          Delete
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Post Form Component
// Post Form Component
const PostForm = ({ initialData, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    featured_image: null,
    is_featured: initialData?.is_featured ? 1 : 0,
    published_at: initialData?.published_at ? new Date(initialData.published_at).toISOString().split('T')[0] : '',
  });
  const [preview, setPreview] = useState(initialData?.featured_image || null);
  const [imageError, setImageError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setImageError('Image size should be less than 2MB');
        return;
      }
      setImageError('');
      setFormData(prev => ({ ...prev, featured_image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (imageError) return;

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        submitData.append(key, formData[key]);
      }
    });
    onSubmit(submitData);
  };

  const addParagraphSeparator = () => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + '$$@par@$$'
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input
          name="title"
          variant='orange'
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
          disabled={isSubmitting}
          placeholder="Enter post title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Featured Image</label>
        <div className="space-y-2">
          <Input
            type="file"
            variant='orange'
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSubmitting}
          />
          {imageError && (
            <p className="text-sm text-red-500">{imageError}</p>
          )}
          {preview && (
            <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={() => setPreview(null)}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Excerpt</label>
        <Textarea
          value={formData.excerpt}
          variant='orange'
          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          required
          disabled={isSubmitting}
          placeholder="Brief description of the post"
          className="resize-none"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        <div className="flex flex-col gap-2">
          <Textarea
            value={formData.content}
            variant='orange'
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            required
            disabled={isSubmitting}
            placeholder="Full post content"
            className="min-h-[200px] resize-none"
            rows={8}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={addParagraphSeparator}
            disabled={isSubmitting}
          >
            Add Paragraph Separator ($$@par@$$)
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_featured"
          checked={formData.is_featured === 1}
          onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked ? 1 : 0 }))}
          disabled={isSubmitting}
          className="rounded border-gray-300 focus:ring-orange-500"
        />
        <label htmlFor="is_featured" className="text-sm font-medium cursor-pointer">
          Featured Post
        </label>
      </div>

      <Button variant='waguer3' type="submit" className="w-full" disabled={isSubmitting || imageError}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {initialData ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          initialData ? 'Update Post' : 'Create Post'
        )}
      </Button>
    </form>
  );
};

// View Dialog Component
const ViewDialog = ({ post, isOpen, onClose }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="w-[95vw] max-w-[800px] h-[90vh] max-h-[900px] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold flex items-center gap-2">
          {post?.title}
          {post?.is_featured && (
            <Badge variant="secondary">
              <Star className="w-3 h-3 mr-1 text-yellow-500" />
              Featured
            </Badge>
          )}
        </DialogTitle>
      </DialogHeader>
      <div className="mt-4 space-y-4">
        {post?.featured_image && (
          <div className="relative w-full h-48 sm:h-64 md:h-96 bg-gray-100 rounded overflow-hidden">
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold">Excerpt</h3>
          <p className="text-gray-600">{post?.excerpt}</p>
          <h3 className="text-lg font-semibold mt-4">Content</h3>
          <div className="text-gray-800 whitespace-pre-wrap">{post?.content}</div>
        </div>
      </div>
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// Main Component
const PostsManagement = () => {
  const { categoryId } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const api = useApi();
  const token = getToken();

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/categories/${categoryId}/posts`, {
        headers: authHeaders
      });
      setPosts(response.data.posts);
      setCategory(response.data);
    } catch (err) {
      toast.error('Failed to fetch posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [categoryId]);

  const handleCreate = async (data) => {
    try {
      setIsSubmitting(true);
      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      await api.post(`/api/admin/categories/${categoryId}/posts`, data, { 
        headers,
        transformRequest: (data) => data
      });
      
      await fetchPosts();
      setIsOpen(false);
      toast.success('Post created successfully');
    } catch (err) {
      toast.error('Failed to create post: ' + (err.response?.data?.message || err.message));
      console.error('Create Error:', err.response?.data || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      setIsSubmitting(true);
      
      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      data.append('_method', 'PUT');

      await api.post(`/api/admin/posts/${currentPost.id}`, data, { 
        headers,
        transformRequest: (data) => data
      });
      
      await fetchPosts();
      setIsOpen(false);
      toast.success('Post updated successfully');
    } catch (err) {
      toast.error('Failed to update post: ' + (err.response?.data?.message || err.message));
      console.error('Update Error:', err.response?.data || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsSubmitting(true);
      await api.delete(`/api/admin/posts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log(id)
      await fetchPosts();
      toast.success('Post deleted successfully');
    } catch (err) {
      toast.error('Failed to delete post: ' + (err.response?.data?.message || err.message));
      console.error('Delete Error:', err.response?.data || err);
    } finally {
      setIsSubmitting(false);
      setDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl text-orange-600 font-bold">{category?.name} Posts Management</h1>
        <Button 
          variant="waguer3"
          onClick={() => { setCurrentPost(null); setIsOpen(true); }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
          Add Post
        </Button>
      </div>

      <div className="grid gap-4">
        {posts.map(post => (
          <PostItem
            key={post.id}
            post={post}
            onView={() => { setSelectedPost(post); setViewDialogOpen(true); }}
            onEdit={() => { setCurrentPost(post); setIsOpen(true); }}
            onDelete={() => openDeleteDialog(post)}
            isSubmitting={isSubmitting}
          />
        ))}

        {posts.length === 0 && (
          <Card>
            <CardContent className="text-center py-8 text-gray-500">
              No posts found. Create your first post by clicking the "Add Post" button.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => handleDelete(postToDelete?.id)}
        title="Delete Post"
        message={`Are you sure you want to delete the post "${postToDelete?.title}"? This action cannot be undone.`}
      />

      {/* Create/Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] max-w-[800px] h-[90vh] max-h-[900px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentPost ? 'Edit Post' : 'Create Post'}</DialogTitle>
          </DialogHeader>
          <PostForm 
            initialData={currentPost}
            onSubmit={currentPost ? handleUpdate : handleCreate}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <ViewDialog 
        post={selectedPost} 
        isOpen={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)} 
      />
    </div>
  );
};

export default PostsManagement;