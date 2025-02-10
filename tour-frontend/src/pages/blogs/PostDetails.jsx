import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, Eye, Tag, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useApi from '@/services/api';

const RelatedPostCard = ({ post }) => (
  <Link to={`/blog/post/${post.slug}`} className="group">
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div 
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${post.featured_image})` }}
      />
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Tag className="w-4 h-4 mr-1 text-orange-500" />
          <span>{post.category.name}</span>
        </div>
        <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-600 transition-colors">
          {post.title}
        </h3>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{new Date(post.published_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  </Link>
);

const PostDetails = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const api = useApi();

  // Fetch main post
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await api.get(`/api/blog/${slug}`);
        const postData = response.data.post;
        
        if (postData.content) {
          postData.formattedContent = postData.content
            .split('$$@par@$$')
            .map(para => para.trim())
            .filter(para => para.length > 0);
        }
        
        setPost(postData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchPostDetails();
    window.scrollTo(0, 0);
  }, [slug]);

  // Fetch related posts
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (!post) return;
      
      try {
        const response = await api.get(`/api/blog/${slug}/related`);
        setRelatedPosts(response.data.posts);
        setLoadingRelated(false);
      } catch (error) {
        setLoadingRelated(false);
      }
    };

    if (post) {
      fetchRelatedPosts();
    }
  }, [post, slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.title,
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (error) {
      alert('Failed to copy link. Please try again.');
    }
  };

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
        <article className="prose prose-orange max-w-none">
          {post.formattedContent ? (
            post.formattedContent.map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))
          ) : (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          )}
        </article>

        {/* Share Button */}
        <div className="mt-8 flex justify-between items-center border-t pt-6 border-orange-200">
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              className="text-orange-600"
              onClick={handleShare}
            >
              <Share2 className="mr-2" /> Share
            </Button>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {!loadingRelated && relatedPosts.length > 0 && (
        <div className="bg-orange-50/50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl text-orange-700 font-bold mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <RelatedPostCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;