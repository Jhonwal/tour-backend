import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, User, ChevronRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Desert Tours',
    'City Tours',
    'Cultural Experiences',
    'Adventure',
    'Food & Cuisine'
  ];

  const featuredPost = {
    title: "Ultimate Guide to Exploring the Sahara Desert",
    excerpt: "Discover the magic of Morocco's greatest desert, from camel treks to luxury camping under the stars...",
    image: './images/Rabat.webp',
    category: "Desert Tours",
    author: "Mohammed Atlas",
    date: "Jan 15, 2025",
    readTime: "8 min read"
  };

  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Must-Visit Markets in Marrakech",
      excerpt: "Explore the vibrant souks and traditional markets of Marrakech, where ancient traditions meet modern commerce...",
      image: './images/Rabat.webp',
      category: "City Tours",
      author: "Sarah Desert",
      date: "Jan 20, 2025",
      readTime: "5 min read",
      tags: ["Markets", "Shopping", "Culture"]
    },
    {
      id: 2,
      title: "Traditional Moroccan Cooking Class Experience",
      excerpt: "Learn the secrets of authentic Moroccan cuisine with our expert local chefs in a traditional riad setting...",
      image: './images/Rabat.webp',
      category: "Food & Cuisine",
      author: "Chef Hassan",
      date: "Jan 18, 2025",
      readTime: "6 min read",
      tags: ["Food", "Cooking", "Culture"]
    },
    {
      id: 3,
      title: "Traditional Moroccan Cooking Class Experience",
      excerpt: "Learn the secrets of authentic Moroccan cuisine with our expert local chefs in a traditional riad setting...",
      image: './images/Rabat.webp',
      category: "Food & Cuisine",
      author: "Chef Hassan",
      date: "Jan 18, 2025",
      readTime: "6 min read",
      tags: ["Food", "Cooking", "Culture"]
    },
    {
      id: 4,
      title: "Traditional Moroccan Cooking Class Experience",
      excerpt: "Learn the secrets of authentic Moroccan cuisine with our expert local chefs in a traditional riad setting...",
      image: './images/Rabat.webp',
      category: "Food & Cuisine",
      author: "Chef Hassan",
      date: "Jan 18, 2025",
      readTime: "6 min read",
      tags: ["Food", "Cooking", "Culture"]
    },
    // Add more blog posts as needed
  ];

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-300 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Discover Morocco Through Our Stories
          </h1>
          <p className="text-xl text-center max-w-2xl mx-auto text-orange-100">
            Immerse yourself in tales of adventure, culture, and discovery across the magical kingdom of Morocco
          </p>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              variant='orange'
              placeholder="Search articles..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`${
                  selectedCategory === category
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "text-orange-600 hover:bg-orange-100"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="md:flex">
            <div className="md:w-2/3 h-[250px]">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full object-cover"
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
                <span>{featuredPost.author}</span>
                <span className="mx-2">•</span>
                <Calendar className="w-4 h-4 mr-2" />
                <span>{featuredPost.date}</span>
                <span className="mx-2">•</span>
                <Clock className="w-4 h-4 mr-2" />
                <span>{featuredPost.readTime}</span>
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Read More <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User className="w-4 h-4 mr-2" />
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{post.readTime}</span>
                </div>
                <Button variant="outline" className="text-orange-600 hover:bg-orange-50">
                  Read More <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h3>
          <p className="mb-6 text-orange-100">
            Get the latest travel tips, hidden gems, and exclusive offers delivered to your inbox
          </p>
          <div className="flex max-w-md mx-auto gap-4">
            <Input
              type="email"
              variant='orange'
              placeholder="Enter your email"
              className="bg-white"
            />
            <Button className="bg-white text-orange-600 hover:bg-orange-100">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;