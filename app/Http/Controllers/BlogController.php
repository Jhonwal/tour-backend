<?php
namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['category', 'author'])
            ->latest('published_at');

        // Search filter
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'LIKE', '%' . $request->search . '%')
                  ->orWhere('excerpt', 'LIKE', '%' . $request->search . '%');
            });
        }

        // Category filter
        if ($request->filled('category') && $request->category !== 'All') {
            $category = Category::where('name', $request->category)->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        $posts = $query->paginate(9);
        foreach($posts as $post){
            $post->featured_image = URL::to($post->featured_image);
        }
        $featuredPost = Post::with('author')->where('is_featured', true)->first();
        $featuredPost->featured_image = URL::to($featuredPost->featured_image);
        return response()->json([
            'posts' => $posts,
            'featured_post' => $featuredPost,
            'categories' => Category::all()
        ]);
    }

    public function show($slug)
    {
        $post = Post::with(['category', 'author'])
            ->where('slug', $slug)
            ->firstOrFail();
        $post->featured_image = URL::to($post->featured_image);

        // Fetch related posts in the same category
        $relatedPosts = Post::with(['category', 'author'])->where('category_id', $post->category_id)
            ->where('id', '!=', $post->id)
            ->limit(3)
            ->get();
        foreach($relatedPosts as $post){
            $post->featured_image = URL::to($post->featured_image);
        }   
        $post->increment('views');

        return response()->json([
            'post' => $post,
            'related_posts' => $relatedPosts
        ]);
    }
}