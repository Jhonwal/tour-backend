import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Calendar, User, Eye, Tag, Share2, 
  Clock, ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import useApi from '@/services/api';

const PostDetails = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await api.get(`/api/blog/${slug}`);
        setPost(response.data.post);
        setRelatedPosts(response.data.related_posts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post details', error);
        setLoading(false);
      }
    };

    fetchPostDetails();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <p className="text-orange-500">Loading post details...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <p className="text-red-500">Post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Post Header */}
      <header 
        className="relative h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${post.featured_image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-8">
          <div className="container mx-auto">
            <div className="bg-white bg-opacity-90 p-6 rounded-xl max-w-3xl mx-auto">
              <div className="flex items-center mb-4 space-x-4">
                <div className="flex items-center text-gray-600">
                  <Tag className="w-5 h-5 mr-2 text-orange-500" />
                  <span>{post.category.name}</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {post.title}
              </h1>
              <div className="flex items-center text-gray-600 space-x-4">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-orange-500" />
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                  <span>{new Date(post.published_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-orange-500" />
                  <span>{post.views} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Post Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <article 
          className="prose prose-orange max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share and Social */}
        <div className="mt-8 flex justify-between items-center border-t pt-6 border-orange-200">
          <div className="flex space-x-4">
            <Button variant="outline" className="text-orange-600">
              <Share2 className="mr-2" /> Share
            </Button>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Related Posts
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((related) => (
              <div 
                key={related.id} 
                className="bg-orange-50 rounded-xl overflow-hidden shadow-lg"
              >
                <img 
                  src={related.featured_image} 
                  alt={related.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{related.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {related.excerpt}
                  </p>
                  <Link to={`/blog/post/${related.slug}`} className='w-full flex justify-end'>
                    <Button variant="link" className="text-orange-600 p-0">
                        Read More <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PostDetails;