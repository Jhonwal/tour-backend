<?php

// app/Http/Controllers/ImageController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function index()
    {
        // Get all files in the 'public/images' directory
        $images = Storage::disk('public')->files('images');
        
        // Map the files to include the URL of each image
        $imageUrls = array_map(function ($image) {
            return url('storage/' . $image);
        }, $images);

        // Return the image URLs as a JSON response
        return response()->json($imageUrls);
    }
}

