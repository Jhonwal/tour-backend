<?php

namespace App\Http\Controllers;

use App\Models\DayImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DayImageController extends Controller
{
    public function uploadPictures(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'day_id' => 'required|integer',
            'picture_count' => 'required|integer|min:0',  // Added a field for picture count
            'pictures' => 'nullable|array',  // Allow pictures to be null (no pictures)
            'pictures.*' => 'file|mimes:jpeg,png,jpg,webp|max:2048', // Validate files if provided
        ]);

        $dayId = $request->input('day_id');
        $pictureCount = $request->input('picture_count');
        $uploadedFiles = [];

        // Check if picture count is greater than 0
        if ($pictureCount > 0) {
            // Check if files are uploaded
            if ($request->hasFile('pictures') && count($request->file('pictures')) > 0) {
                foreach ($request->file('pictures') as $file) {
                    // Store the file in the 'public/tour_pictures' directory
                    $path = $file->store('tour/tour_days', 'public');

                    // Save the file path in the 'day_images' table
                    $dayImage = DayImage::create([
                        'url' => Storage::url($path),
                        'day_id' => $dayId,
                    ]);

                    $uploadedFiles[] = $dayImage;
                }
            }
        }

        // Return the response
        return response()->json([
            'message' => $uploadedFiles ? 'Pictures uploaded successfully for the day: ' : 'No pictures uploaded for this day: ',
            'uploaded_files' => $uploadedFiles,
        ], 201);
    }
}
