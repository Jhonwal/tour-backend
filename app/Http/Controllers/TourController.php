<?php

namespace App\Http\Controllers;

use App\Models\Tour;
use App\Models\User;
use App\Models\Service;
use App\Models\TourDay;
use App\Models\TourType;
use App\Models\TourImage;
use App\Models\TourPrice;
use App\Models\Destination;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TourController extends Controller
{
    public function index(Request $request)
    {
        $tours = Tour::all(); 
        $type = TourType::all();
        return response()->json([
            'tours' => $tours,
            'types' => $type,
        ]);
    }
    public function tour_type($slug)
    {
        $type = TourType::where('slug', $slug)->first();
        $tours = Tour::where('tour_type_id', $type->id)->orderBy('created_at', 'desc')->get();
        $tours->each(function ($tour) {
            $tour->banner = URL::to($tour->banner);
            $tour->map_image = URL::to($tour->map_image);
        });
        return response()->json([
            'tours' => $tours,
            'type' => $type,
        ]);
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
            'name' => 'required|string',
            'depart_city' => 'required|string|max:255',
            'end_city' => 'required|string|max:255',
            'description' => 'required|string|min:10',
            'map_image' => 'required|file|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // Max size: 2MB
            'banner' => 'required|file|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // Max size: 2MB
            'duration' => 'required|integer|min:1',
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
        $tour->name = $request->name;
        $tour->slug = Str::slug($tour->name);
        $tour->depart_city = $request->depart_city;
        $tour->end_city = $request->end_city;
        $tour->description = $request->description;
        $tour->map_image = Storage::url($mapImagePath); // Store file path
        $tour->banner = Storage::url($bannerPath); // Store file path
        $tour->duration = $request->duration;
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
        if ($request->file('additional_images')  !== null) {
            foreach ($request->file('additional_images') as $file) {
                    $filePath = $file->store('public/tours/additional');
                    TourImage::create([
                        'url' => Storage::url($filePath),
                        'tour_id' => $tourID->id
                    ]);
            }
        }
        // Return success response
        return response()->json(['message' => 'Tour added successfully!', 'tour' => $tour], 201);
    }
    public function show($id)
    {
        $tour = Tour::with([
            'destinations',
            'tourImages',
            'price',
            'tourDays',
            'excludedServices',
            'includedServices',
        ])->findOrFail($id);
    
        // Ensure all image paths are full URLs
        $tour->banner = URL::to($tour->banner);
        $tour->map_image = URL::to($tour->map_image);
    
        foreach ($tour->tourImages as $image) {
            $image->url = URL::to($image->url);
        }
    
        return response()->json($tour);
    }
    public function showSlug($slug)
    {
        $tour = Tour::with([
            'destinations',
            'tourImages',
            'price',
            'tourDays',
            'excludedServices',
            'includedServices',
        ])->where('slug', $slug)->first();
    
        // Ensure all image paths are full URLs
        $tour->banner = URL::to($tour->banner);
        $tour->map_image = URL::to($tour->map_image);
    
        foreach ($tour->tourImages as $image) {
            $image->url = URL::to($image->url);
        }
    
        return response()->json($tour);
    }
    public function getThree() 
    {

        $destinations = Tour::limit(6)->get();
        
        $destinations->each(function ($destination) {
            $destination->banner = URL::to($destination->banner);
            $destination->map_image = URL::to($destination->map_image);
        });
    
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
    public function showTour($id){
        $tour = Tour::find($id);
        if ($tour) {
            return response()->json($tour);
            } else {
                return response()->json(['error' => 'Tour not found'], 404);
        }
    }
    public function getTourDetails($id): JsonResponse
    {
        try {
            // Fetch the tour details
            $tour = Tour::with(['tourType'])
                ->where('id', $id)
                ->firstOrFail();
                $tour->banner = URL::to($tour->banner);
                $tour->map_image = URL::to($tour->map_image);
            // Fetch related images
            $images = TourImage::where('tour_id', $id)->get();
            foreach ($images as $image) {
                $image->url = URL::to($image->url);
            }
            // Fetch tour days
            $days = TourDay::with('dayImages')
                ->where('tour_id', $id)
                ->get();
            foreach ($days as $day) {
                foreach ($day->dayImages as $image) {
                    $image->url = URL::to($image->url);
                }
            }
                
            // Fetch destinations
            $destinations = Destination::where('tour_id', $id)->get();

            // Fetch services
            $services = Service::where('tour_id', $id)->get();

            // Fetch prices
            $prices = TourPrice::where('tour_id', $id)->get();

            // Combine all data into a single response
            $data = [
                'tour' => $tour,
                'images' => $images,
                'days' => $days,
                'destinations' => $destinations,
                'services' => $services,
                'prices' => $prices,
            ];

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching tour details: ' . $e->getMessage(),
            ], 500);
        }
    }   
}
