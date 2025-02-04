<?php

namespace App\Http\Controllers;

use Log;
use App\Models\Post;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Get paginated posts with optional search
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $posts = Post::with(['category', 'author'])
                ->when($request->search, function ($query, $search) {
                    return $query->where('title', 'like', "%{$search}%");
                })
                ->latest()
                ->paginate(10);

            return response()->json($posts);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch posts'], 500);
        }
    }

    /**
     * Get posts for a specific category
     */
    public function getCategoryPosts(Category $category): JsonResponse
    {
        try {
            $posts = $category->posts()
                ->with(['author'])
                ->latest()
                ->paginate(10);

            return response()->json($posts);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch category posts'], 500);
        }
    }

    /**
     * Store a new post
     */
    public function store(Request $request, $categoryId): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|max:255',
                'excerpt' => 'required',
                'content' => 'required',
                'featured_image' => 'nullable|max:2048',
                'is_featured' => 'boolean',
            ]);

            $post = new Post();
            $post->fill([
                'title' => $validated['title'],
                'slug' => Str::slug($validated['title']),
                'excerpt' => $validated['excerpt'],
                'content' => $validated['content'],
                'category_id' => $categoryId,
                'user_id' => Auth::id(),
                'is_featured' => $request->input('is_featured', false),
                'published_at' => now(),
            ]);

            if ($request->hasFile('featured_image')) {
                $post->featured_image = $this->handleImageUpload($request->file('featured_image'));
            }

            $post->save();

            return response()->json([
                'message' => 'Post created successfully',
                'post' => $post->load('author')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create post',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show post details
     */
    public function show(Post $post): JsonResponse
    {
        try {
            $post->load('author');
            
            return response()->json([
                'post' => [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'content' => $post->content,
                    'featured_image' => $post->featured_image ? URL::to($post->featured_image) : null,
                    'category_id' => $post->category_id,
                    'user_id' => $post->user_id,
                    'published_at' => $post->published_at,
                    'is_featured' => (bool) $post->is_featured,
                    'views' => $post->views,
                    'created_at' => $post->created_at,
                    'updated_at' => $post->updated_at,
                    'author' => [
                        'id' => $post->author->id,
                        'name' => $post->author->name,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch post'], 500);
        }
    }

    /**
     * Update post
     */
    public function update(Request $request, $id): JsonResponse
    {
        $post = Post::find($id);
        try {
            $validated = $request->validate([
                'title' => 'required|max:255',
                'excerpt' => 'required',
                'content' => 'required',
                'featured_image' => 'nullable|image|max:2048',
                'is_featured' => 'boolean',
            ]);

            $post->fill([
                'title' => $validated['title'],
                'category_id' => $post->category_id,
                'user_id' => $post->user_id,
                'slug' => Str::slug($validated['title']),
                'excerpt' => $validated['excerpt'],
                'content' => $validated['content'],
                'is_featured' => $request->input('is_featured', $post->is_featured),
                'published_at' => now(),
            ]);

            if ($request->hasFile('featured_image')) {
                // Delete old image if exists
                if ($post->featured_image) {
                    $this->deleteImage($post->featured_image);
                }
                
                $post->featured_image = $this->handleImageUpload($request->file('featured_image'));
            }

            $post->save();

            return response()->json([
                'message' => 'Post updated successfully',
                'post' => $post->load('author')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update post',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete post
     */
    public function destroy($id): JsonResponse
    {
        $post = Post::find($id);
        try {
            if ($post->featured_image) {
                $this->deleteImage($post->featured_image);
            }

            $post->delete();

            return response()->json([
                'message' => 'Post deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete post',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle image upload
     */
    private function handleImageUpload($image): string
    {
        $path = $image->store('posts', 'public');
        return Storage::url($path);
    }

    /**
     * Delete image from storage
     */
    private function deleteImage(string $imagePath): void
    {
        $path = str_replace('/storage/', '', $imagePath);
        Storage::disk('public')->delete($path);
    }

}