<?php
namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:categories,name',
            'description' => 'nullable',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        return Category::create($validated);
    }
    public function show($id)
    {
        $category = Category::with('posts')->find($id);

        foreach($category->posts as $post){
            $post->featured_image = URL::to($post->featured_image);
        }

        return $category;
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);
    
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
    
        $validated = $request->validate([
            'name' => 'sometimes|unique:categories,name,' . $id,
            'description' => 'nullable',
        ]);
    
        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }
    
        $category->update($validated);
    
        return response()->json($category);
    }

    public function destroy($id)
    {
        // before deleting category delet all posts image of this category from the storage file
        $category = Category::find($id);
        $posts = $category->posts; 
        foreach ($posts as $post) {
            $filePath = str_replace('/storage/', '', $post->featured_image);
 
            if (Storage::disk('public')->exists($filePath)) {
               Storage::disk('public')->delete($filePath);}
        }

        $category->delete();

        
        return response()->json(['message' => 'Category deleted']);
    }
}
