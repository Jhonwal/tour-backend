import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, User, ChevronRight, 
  ChevronLeft, Tag 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useApi from '@/services/api';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/blog', {
          params: { 
            search: searchTerm, 
            category: selectedCategory !== 'All' ? selectedCategory : null,
            page: currentPage
          }
        });
        
        setPosts(response.data.posts.data);
        setTotalPages(response.data.posts.last_page);
        setCategories(['All', ...response.data.categories.map(c => c.name)]);
        setFeaturedPost(response.data.featured_post);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm, selectedCategory, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-300 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Discover Morocco Through Our Stories
          </h1>
          <p className="text-xl text-center max-w-2xl mx-auto text-orange-100">
            Immerse yourself in tales of adventure, culture, and discovery
          </p>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400" />
            <Input
              type="text"
              variant='orange'
              placeholder="Search articles..."
              className="pl-10 w-full border-orange-300 focus:border-orange-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`
                  ${selectedCategory === category 
                    ? "bg-orange-500 hover:bg-orange-600 text-white" 
                    : "text-orange-600 hover:bg-orange-100 border-orange-300"}
                `}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
            <div className="md:flex">
              <div className="md:w-2/3 h-[300px]">
                <img
                  src={featuredPost.featured_image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:w-1/3">
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
                  Featured Post
                </span>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{featuredPost.title}</h2>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User className="w-4 h-4 mr-2" />
                  <span>{featuredPost.author.name}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(featuredPost.published_at).toLocaleDateString()}</span>
                </div>
                <Link to={`/blog/post/${featuredPost.slug}`}>
                  <Button variant='waguer2'>Read More</Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <img 
                src={post.featured_image} 
                alt={post.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <Tag className="w-4 h-4 mr-2 text-orange-500" />
                  <span className="text-sm text-gray-600">
                    {post.category.name}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-2" />
                    <span>{post.author.name}</span>
                  </div>
                  <Link to={`/blog/post/${post.slug}`}>
                    <Button variant="outline" size="sm" className='text-orange-700'>Read More</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-4">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="mr-2" /> Previous
          </Button>
          <span className="self-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;