<?php

namespace App\Http\Controllers;

use App\Models\TourDay;
use App\Models\TourActivite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;

class TourDayController extends Controller
{

    public function index($tour_id) : \Illuminate\Http\JsonResponse
    {
        // Retrieve all records from the tourDay model where tour_id matches the given parameter
        $tourDays = tourDay::where('tour_id', $tour_id)->get();

        // Return the records as a JSON response
        return response()->json($tourDays);
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $tourDay = TourDay::create($request->all());
        return response()->json($tourDay);
    }

    public function updateDayAndActivities(Request $request)
    {
        $validated = $request->validate([
            'tour_id' => 'required|exists:tours,id', // Ensure the tour exists
            'tour_day_id' => 'required|exists:tour_days,id', // Ensure the day exists
            'name' => 'required|string|max:255', // Validate day name
            'description' => 'required|string',
            'hotels' => 'nullable|array',
        ]);

        try {
            // Start a transaction to ensure atomicity
            DB::beginTransaction();

            // Find the TourDay by ID
            $tourDay = TourDay::findOrFail($validated['tour_day_id']);
            //check if the hotels not null than update it 
            if ($validated['hotels']) {
                $tourDay->update(['hotels' => $validated['hotels']]);
            }
            // Update the day name
            $tourDay->name = $validated['name'];
            $tourDay->description = $validated['description'];
            $tourDay->save();
            DB::commit();

            return response()->json(['message' => 'Day updated and activities associated successfully.'], 200);
        } catch (\Exception $e) {
            // Rollback the transaction on error
            DB::rollBack();
            return response()->json(['error' => 'Failed to update day and activities.', 'details' => $e->getMessage()], 500);
        }
    }
    
    public function getDayDetails($id)
    {
        $day = TourDay::with(['dayImages'])->find($id);

        if (!$day) {
            return response()->json(['message' => 'Day not found'], 404);
        }
        // Ensure image URLs are full paths
        foreach ($day->dayImages as $image) {
            $image->url = URL::to($image->url); 
        }
        $day->hotels = json_decode($day->hotels);
        return response()->json($day);
    }

    public function deleteActivity($dayId, $id)
    {
        TourActivite::where('id', $id)
        ->where('tour_day_id', $dayId)
        ->delete();
        return response()->json(['message' => 'Activity deleted successfully.'], 200);
    }
    //add acitvit
    public function addActivity($tourId, $dayId)
    {
        $validated = request()->validate([
            'activity_ids.*' => 'exists:activites,id',
        ]);

        foreach ($validated['activity_ids'] as $activityId) {
            TourActivite::create([
                'tour_id' => $tourId,
                'tour_day_id' => $dayId,
                'activite_id' => $activityId,
            ]);
        }
        return response()->json(['message' => 'Activities added successfully.'], 200);
    }
    public function addHotel(Request $request, $tourDayId)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'link' => 'nullable|url',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }
    
        try {
            $tourDay = TourDay::findOrFail($tourDayId);
            
            // Properly decode existing hotels or initialize empty array
            $hotels = [];
            if ($tourDay->hotels) {
                $hotels = is_array($tourDay->hotels) ? $tourDay->hotels : json_decode($tourDay->hotels, true);
                $hotels = is_array($hotels) ? $hotels : [];
            }
    
            // Add new hotel
            $hotels[] = [
                'name' => $request->name,
                'link' => $request->link,
            ];
    
            // Store as JSON string
            $tourDay->hotels = json_encode($hotels);
            $tourDay->save();
    
            return response()->json(['message' => 'Hotel added successfully.', 'hotels' => $hotels], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to add hotel.', 'details' => $e->getMessage()], 500);
        }
    }
    
    public function deleteHotel($tourDayId, $hotelIndex)
    {
        try {
            $tourDay = TourDay::findOrFail($tourDayId);
            
            // Properly decode existing hotels
            $hotels = [];
            if ($tourDay->hotels) {
                $hotels = is_array($tourDay->hotels) ? $tourDay->hotels : json_decode($tourDay->hotels, true);
                $hotels = is_array($hotels) ? $hotels : [];
            }
    
            // Check if index exists
            if (!isset($hotels[$hotelIndex])) {
                return response()->json(['error' => 'Hotel not found.'], 404);
            }
    
            // Remove hotel at index
            unset($hotels[$hotelIndex]);
            $hotels = array_values($hotels); // Re-index array
    
            // Store as JSON string
            $tourDay->hotels = json_encode($hotels);
            $tourDay->save();
    
            return response()->json(['message' => 'Hotel deleted successfully.', 'hotels' => $hotels], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete hotel.', 'details' => $e->getMessage()], 500);
        }
    }
    
    public function updateHotel(Request $request, $tourDayId, $hotelIndex)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'link' => 'nullable|url',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }
    
        try {
            $tourDay = TourDay::findOrFail($tourDayId);
            
            // Properly decode existing hotels
            $hotels = [];
            if ($tourDay->hotels) {
                $hotels = is_array($tourDay->hotels) ? $tourDay->hotels : json_decode($tourDay->hotels, true);
                $hotels = is_array($hotels) ? $hotels : [];
            }
    
            // Check if index exists
            if (!isset($hotels[$hotelIndex])) {
                return response()->json(['error' => 'Hotel not found.'], 404);
            }
    
            // Update hotel
            $hotels[$hotelIndex] = [
                'name' => $request->name,
                'link' => $request->link,
            ];
    
            // Store as JSON string
            $tourDay->hotels = json_encode($hotels);
            $tourDay->save();
    
            return response()->json(['message' => 'Hotel updated successfully.', 'hotels' => $hotels], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update hotel.', 'details' => $e->getMessage()], 500);
        }
    }
}