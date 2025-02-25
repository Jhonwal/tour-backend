<?php

namespace App\Http\Controllers;

use App\Models\Tour;
use App\Models\User;
use App\Models\Service;
use App\Models\TourDay;
use App\Models\DayImage;
use App\Models\TourType;
use App\Models\Promotion;
use App\Models\TourImage;
use App\Models\TourPrice;
use App\Models\Destination;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
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
    public function allTours(Request $request)
    {
        $tours = Tour::all(); 
        foreach ($tours as $tour) {
            $tour->banner = URL::to($tour->banner);
            $tour->map_image = URL::to($tour->map_image);
        }
        return response()->json([
            'tours' => $tours,
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
        $type->image = URL::to($type->image);
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
            'map_image' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048', // Max size: 2MB
            'banner' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // Max size: 2MB
            'duration' => 'required|integer|min:1',
            'tour_type_id' => 'required|exists:tour_types,id', // Validate against existing tour types
        ]);
    
        // Handle validation failure
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        // Create a new tour record
        $tour = new Tour();
        $tour->name = $request->name;
        $tour->slug = Str::slug($tour->name);
        $tour->depart_city = $request->depart_city;
        $tour->end_city = $request->end_city;
        $tour->description = $request->description;
        $tour->duration = $request->duration;
        $tour->tour_type_id = $request->tour_type_id;
    
        // Handle map image upload if present
        if ($request->hasFile('map_image')) {
            $mapImagePath = $request->file('map_image')->store('public/tours/maps');
            $tour->map_image = Storage::url($mapImagePath); // Store file path
        }
    
        // Handle banner upload if present
        if ($request->hasFile('banner')) {
            $bannerPath = $request->file('banner')->store('public/tours/banners');
            $tour->banner = Storage::url($bannerPath); // Store file path
        }
    
        // Save the tour to the database
        $tour->save();
    
        // Create tour days based on duration
        $tourID = $tour->id; // Use the ID of the newly created tour
        for ($i = 1; $i <= $request->duration; $i++) {
            $tourDay = new TourDay();
            $tourDay->name = 'waguer';
            $tourDay->number = $i;
            $tourDay->tour_id = $tourID;
            $tourDay->save();
        }
    
        // Handle additional images if present
        if ($request->hasFile('additional_images')) {
            foreach ($request->file('additional_images') as $file) {
                $filePath = $file->store('public/tours/additional');
                TourImage::create([
                    'url' => Storage::url($filePath),
                    'tour_id' => $tourID,
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
            'activites',
            'excludedServices',
            'includedServices',
        ])->findOrFail($id);

        $tourId =  $tour->id;
        $discountValue = Promotion::whereHas('tours', function ($query) use ($tourId) {
            $query->where('tour_id', $tourId);
        })
        ->where('start_date', '<=', date('Y-m-d'))
        ->where('end_date', '>=', date('Y-m-d'))
        ->orderByDesc('start_date')
        ->value('discount_value'); 
        //make discountvalue 0 if null
        $discountValue = $discountValue ?? 0;
        $tour->promotions = $discountValue;

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
            'activites',
            'excludedServices',
            'includedServices',
        ])->where('slug', $slug)->first();
        
        $tourId =  $tour->id;
        $discountValue = Promotion::whereHas('tours', function ($query) use ($tourId) {
            $query->where('tour_id', $tourId);
        })
        ->where('start_date', '<=', date('Y-m-d'))
        ->where('end_date', '>=', date('Y-m-d'))
        ->orderByDesc('start_date')
        ->value('discount_value'); 
        $discountValue = $discountValue ?? 0;
        $tour->promotions = $discountValue;
        
        $tour->banner = URL::to($tour->banner);
        $tour->map_image = URL::to($tour->map_image);
    
        foreach ($tour->tourImages as $image) {
            $image->url = URL::to($image->url);
        }
        //add a row promotion to the tour
        return response()->json($tour);
    }
    public function getThree() 
    {

        $destinations = Tour::with('tourType')->limit(6)->get();
        
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
                $day->hotels = $day->hotels ? json_decode($day->hotels) : [];
            }
                
            // Fetch destinations
            $destinations = Destination::where('tour_id', $id)->get();

            // Fetch services
            $services = Service::where('tour_id', $id)->get();

            // Fetch prices
            $prices = TourPrice::where('tour_id', $id)->get();

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
    public function updateTourInfo(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $tour = Tour::with(['destinations', 'tourDays'])->findOrFail($id);
            $totalNights = $tour->destinations->sum('number_of_nights');
            $newDuration = (int) $request->input('duration');

            if ($totalNights !== $newDuration) {
                $destinations = $tour->destinations;
                $count = count($destinations);
                if ($count > 0) {
                    $nightsPerDestination = intdiv($newDuration, $count);
                    $remainingNights = $newDuration % $count;

                    foreach ($destinations as $index => $destination) {
                        $destination->number_of_nights = $nightsPerDestination + ($index < $remainingNights ? 1 : 0);
                        $destination->save();
                    }
                }
            }

            if ($newDuration < $tour->duration) {
                $daysToDelete = json_decode($request->input('days_to_delete', '[]'));

                if (count($daysToDelete) !== ($tour->duration - $newDuration)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Incorrect number of days selected for deletion'
                    ], 422);
                }

                foreach ($daysToDelete as $dayId) {
                    $day = TourDay::find($dayId);
                    if ($day) {
                        foreach ($day->dayImages as $image) {
                            $path = str_replace('/storage/', '', $image->url);
                            if (Storage::disk('public')->exists($path)) {
                                Storage::disk('public')->delete($path);
                            }
                            $image->delete();
                        }
                        $day->delete();
                    }
                }

                $remainingDays = $tour->tourDays()
                    ->whereNotIn('id', $daysToDelete)
                    ->orderBy('number')
                    ->get();

                foreach ($remainingDays as $index => $day) {
                    $day->update(['number' => $index + 1]);
                }
            }elseif ($newDuration > $tour->duration) {
                $newDays = $newDuration - $tour->duration;
                for ($i = 1; $i <= $newDays; $i++) {
                    $day = new TourDay();
                    $day->number = $tour->tourDays()->max('number') + 1 ?? 1;
                    $day->name = 'new day';
                    $day->tour_id = $tour->id;
                    $day->save();
                }
            }

            $tour->name = $request->input('name');
            $tour->depart_city = $request->input('depart_city');
            $tour->end_city = $request->input('end_city');
            $tour->description = $request->input('description');
            $tour->duration = $newDuration;

            if ($request->hasFile('map_image')) {
                if ($tour->map_image) {
                    $path = str_replace('/storage/', '', $tour->map_image);
                    if (Storage::disk('public')->exists($path)) {
                        Storage::disk('public')->delete($path);
                    }
                }
                $mapImagePath = $request->file('map_image')->store('tours/map', 'public');
                $tour->map_image = Storage::url($mapImagePath);
            }

            if ($request->hasFile('banner')) {
                if ($tour->banner) {
                    $path = str_replace('/storage/', '', $tour->banner);
                    if (Storage::disk('public')->exists($path)) {
                        Storage::disk('public')->delete($path);
                    }
                }
                $bannerPath = $request->file('banner')->store('tours/banner', 'public');
                $tour->banner = Storage::url($bannerPath);
            }

            $tour->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Tour information updated successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error updating tour information: ' . $e->getMessage()
            ], 500);
        }
    }

 // Handle tour images
 public function updateTourImages(Request $request, $id)
 {
     try {
         $tour = Tour::findOrFail($id);

         if ($request->hasFile('new_images_0')) {
             $i = 0;
             while ($request->hasFile("new_images_$i")) {
                 $imagePath = $request->file("new_images_$i")->store('tours/additional', 'public');
                 TourImage::create([
                     'url' => Storage::url($imagePath),
                     'tour_id' => $tour->id
                 ]);
                 $i++;
             }
         }

         return response()->json([
             'success' => true,
             'message' => 'Tour images updated successfully'
         ]);

     } catch (\Exception $e) {
         return response()->json([
             'success' => false,
             'message' => 'Error updating tour images: ' . $e->getMessage()
         ], 500);
     }
 }

 // Update single tour day
 public function updateTourDay(Request $request, $tourId, $dayId)
 {
     try {
         $day = TourDay::where('tour_id', $tourId)
                      ->where('id', $dayId)
                      ->firstOrFail();

         $day->name = $request->input('name');
         $day->description = $request->input('description');
         $day->save();

         // Handle day images
         if ($request->hasFile('new_images_0')) {
             $i = 0;
             while ($request->hasFile("new_images_$i")) {
                 $imagePath = $request->file("new_images_$i")->store('tours/tour_days', 'public');
                 DayImage::create([
                     'url' => Storage::url($imagePath),
                     'day_id' => $day->id
                 ]);
                 $i++;
             }
         }

         return response()->json([
             'success' => true,
             'message' => 'Tour day updated successfully'
         ]);

     } catch (\Exception $e) {
         return response()->json([
             'success' => false,
             'message' => 'Error updating tour day: ' . $e->getMessage()
         ], 500);
     }
 }

 // Update single service
 public function updateService(Request $request, $tourId, $serviceId)
 {
     try {
         $service = Service::where('tour_id', $tourId)
                         ->where('id', $serviceId)
                         ->firstOrFail();

         $service->update([
             'type' => $request->input('type'),
             'services' => $request->input('services'),
             'services_description' => $request->input('services_description')
         ]);

         return response()->json([
             'success' => true,
             'message' => 'Service updated successfully'
         ]);

     } catch (\Exception $e) {
         return response()->json([
             'success' => false,
             'message' => 'Error updating service: ' . $e->getMessage()
         ], 500);
     }
 }

 // Update destinations
 public function updateDestinations(Request $request, $tourId)
 {
     try {
         $destinations = $request->input('destinations');
         
         foreach ($destinations as $destData) {
             Destination::where('tour_id', $tourId)
                       ->where('id', $destData['id'])
                       ->update([
                           'name' => $destData['name'],
                           'number_of_nights' => $destData['number_of_nights']
                       ]);
         }

         return response()->json([
             'success' => true,
             'message' => 'Destinations updated successfully'
         ]);

     } catch (\Exception $e) {
         return response()->json([
             'success' => false,
             'message' => 'Error updating destinations: ' . $e->getMessage()
         ], 500);
     }
 }

 // Update tour prices
 public function updatePrices(Request $request, $tourId)
 {
     try {
         $priceRecord = TourPrice::where('tour_id', $tourId)->firstOrFail();
         
         $priceColumns = [
             '3-stars|2', '4-stars|2', '4&5-stars|2', '5-stars|2',
             '3-stars|3-4', '4-stars|3-4', '4&5-stars|3-4', '5-stars|3-4',
             '3-stars|5<n', '4-stars|5<n', '4&5-stars|5<n', '5-stars|5<n'
         ];

         $priceData = [];
         foreach ($priceColumns as $column) {
             $priceData[$column] = $request->input($column);
         }

         $priceRecord->update($priceData);

         return response()->json([
             'success' => true,
             'message' => 'Prices updated successfully'
         ]);

     } catch (\Exception $e) {
         return response()->json([
             'success' => false,
             'message' => 'Error updating prices: ' . $e->getMessage()
         ], 500);
     }
 }

 // Delete tour image
 public function deleteTourImage($id)
 {
     try {
         $image = TourImage::findOrFail($id);
 
         $filePath = str_replace('/storage/', '', $image->url);
 
         if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);}
          $image->delete();
 
         return response()->json([
             'success' => true,
             'message' => 'Tour image deleted successfully'
         ]);
     } catch (\Exception $e) {
         return response()->json([
             'success' => false,
             'message' => 'Error deleting tour image: ' . $e->getMessage()
         ], 500);
     }
 }
 

 public function deleteDayImage($id)
 {
     try {
         $image = DayImage::findOrFail($id);
         $filePath = str_replace('/storage/', '', $image->url);
 
         if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);}
          $image->delete();
 
         return response()->json([
             'success' => true,
             'message' => 'Tour image deleted successfully'
         ]);
     } catch (\Exception $e) {
         return response()->json([
             'success' => false,
             'message' => 'Error deleting tour image: ' . $e->getMessage()
         ], 500);
     }
 }
 public function destroy($id)
{
    try {
        DB::beginTransaction();

        // Find the tour
        $tour = Tour::with([
            'tourImages',
            'tourDays.dayImages',
        ])->findOrFail($id);

        // Delete tour images from storage and database
        foreach ($tour->tourImages as $image) {
            $filePath = str_replace('/storage/', '', $image->url);
            if (Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
            $image->delete();
        }

        // Delete day images from storage and database
        foreach ($tour->tourDays as $day) {
            foreach ($day->dayImages as $dayImage) {
                $filePath = str_replace('/storage/', '', $dayImage->url);
                if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                }
                $dayImage->delete();
            }
            $day->delete(); // Delete the tour day
        }

        // Delete the tour's banner and map image from storage
        if ($tour->banner) {
            $bannerPath = str_replace('/storage/', '', $tour->banner);
            if (Storage::disk('public')->exists($bannerPath)) {
                Storage::disk('public')->delete($bannerPath);
            }
        }

        if ($tour->map_image) {
            $mapImagePath = str_replace('/storage/', '', $tour->map_image);
            if (Storage::disk('public')->exists($mapImagePath)) {
                Storage::disk('public')->delete($mapImagePath);
            }
        }

        // Finally, delete the tour itself
        $tour->delete();

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Tour and all related data deleted successfully',
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => 'Error deleting tour: ' . $e->getMessage(),
        ], 500);
    }
}

    // Function to attach activities to a tour
    public function attachActivities(Request $request, $tourId)
    {
        // Validate the request
        $request->validate([
            'activity_ids' => 'required|array',
            'activity_ids.*' => 'exists:activites,id',
        ]);

        // Find the tour
        $tour = Tour::findOrFail($tourId);

        $tour->activites()->syncWithoutDetaching($request->activity_ids);

        return response()->json([
            'message' => 'Activities attached successfully',
        ]);
    }

    public function detachActivities(Request $request, $tourId)
    {
        // Validate the request
        $request->validate([
            'activity_ids' => 'required|array',
            'activity_ids.*' => 'exists:activites,id',
        ]);

        // Find the tour
        $tour = Tour::findOrFail($tourId);

        // Detach activities from the tour
        $tour->activites()->detach($request->activity_ids);

        return response()->json([
            'message' => 'Activities detached successfully',
        ]);
    }
    // Get activities associated with the tour
    public function getTourActivities($tourId)
    {
        $tour = Tour::findOrFail($tourId);
        $activities = $tour->activites;
        return response()->json($activities);
    }

    // Detach an activity from the tour
    public function detachActivity($tourId, $activityId)
    {
        $tour = Tour::findOrFail($tourId);
        $tour->activites()->detach($activityId);
        return response()->json(['message' => 'Activity detached successfully']);
    }
}