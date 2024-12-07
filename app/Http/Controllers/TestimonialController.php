<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;


class TestimonialController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|min:10',
            'rating' => 'required|integer|min:1|max:5',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate avatar as image
        ]);

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $avatarName = $avatar->store('public/testemonial');;
            $avatarPath = Storage::url($avatarName);
            $validatedData['avatar'] = $avatarPath;
        }
        $validatedData['state'] = 'pending';
        $testimonial = Testimonial::create($validatedData);

        return response()->json([
            'message' => 'Testimonial added successfully!',
            'testimonial' => $testimonial,
        ], 201);
    }

    public function index()
    {
        $testimonials = Testimonial::all()->where('state', 'accept');

        // Update avatar URL for each testimonial
        $testimonials->each(function ($testimonial) {
            $testimonial->avatar = URL::to($testimonial->avatar);
        });

        return response()->json($testimonials);
    }
    public function updateState(Request $request, $id)
    {
        $request->validate([
            'state' => 'required|in:pending,accept,decline',
        ]);

        $testimonial = Testimonial::find($id);
        if (!$testimonial) {
            return response()->json(['error' => 'Testimonial not found'], 404);
        }

        $testimonial->update(['state' => $request->state]);

        return response()->json(['message' => 'State updated successfully', 'testimonial' => $testimonial]);
    }
    public function showAll(){
        return Testimonial::all();
    }
    public function destroy($id)
    {
        try {
            // Find the testimonial by ID
            $testimonial = Testimonial::findOrFail($id);
    
            // Delete the testimonial
            $testimonial->delete();
    
            // Return success response
            return response()->json(['message' => 'Testimonial deleted successfully.'], 200);
        } catch (ModelNotFoundException $e) {
            // Return error if testimonial not found
            return response()->json(['error' => 'Testimonial not found.'], 404);
        } catch (\Exception $e) {
            // Handle other exceptions
            return response()->json(['error' => 'An error occurred while deleting the testimonial.'], 500);
        }
    }
    
}
