<?php

namespace App\Http\Controllers;
use App\Models\Tour;
use App\Models\TourDay;
use App\Models\TourImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TourController extends Controller
{
    public function index()
    {
        $destinations = Tour::all();
        return response()->json($destinations);
    }
    /**
     * Store a new tour.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Define validation rules
        $validator = Validator::make($request->all(), [
            'depart_city' => 'required|string|max:255',
            'end_city' => 'required|string|max:255',
            'description' => 'required|string|min:10',
            'map_image' => 'required|file|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // Max size: 2MB
            'banner' => 'required|file|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // Max size: 2MB
            'duration' => 'required|integer|min:1',
            'max_participants' => 'required|integer|min:1',
            'tour_type_id' => 'required|exists:tour_types,id', // Validate against existing tour types
        ]);

        // Handle validation failure
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Handle file uploads
        $mapImagePath = $request->file('map_image')->store('public/tours/maps');
        $bannerPath = $request->file('banner')->store('public/tours/banners');
        // Create a new tour record
        $tour = new Tour();
        $tour->depart_city = $request->depart_city;
        $tour->end_city = $request->end_city;
        $tour->description = $request->description;
        $tour->map_image = Storage::url($mapImagePath); // Store file path
        $tour->banner = Storage::url($bannerPath); // Store file path
        $tour->duration = $request->duration;
        $tour->max_participants = $request->max_participants;
        $tour->tour_type_id = $request->tour_type_id;
        // Save the tour to the database
        $tour->save();
        $tourID = Tour::all()->last();
        for ($i = 1;$i <= $request->duration;$i++) {
            $tourDay = new TourDay();
            $tourDay->name = 'waguer';
            $tourDay->number = $i;
            $tourDay->tour_id = $tourID->id;
            $tourDay->save();

        };
        if ($request->hasFile('additional_images')) {
            foreach ($request->file('additional_images') as $file) {
                $filePath = $file->store('public/tours/additional');
                TourImage::create([
                    'url' => $filePath,
                    'tour_id' => $tourID->id
                ]);
            }
        }
        // Return success response
        return response()->json(['message' => 'Tour added successfully!', 'tour' => $tour], 201);
    }
    public function getThree()
    {
        $destinations = Tour::limit(3)->get();
        return response()->json($destinations);
    }
    public function count()
    {
        $numberOfTours = Tour::count();
        return response()->json(['count' => $numberOfTours]);
    }
    public function lastTour() {
        $tour = Tour::all()->last();  // Fetch the last tour

        if ($tour) {
            // Use the relationship method to get related tour days
            $tourDays = $tour->tourDays; // Use the property, not method call
            return response()->json(['tour' => $tour, 'tourDays' => $tourDays]);
        } else {
            return response()->json(['error' => 'No tour found'], 404);
        }
    }

}
