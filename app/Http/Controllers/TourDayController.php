<?php

namespace App\Http\Controllers;

use App\Models\TourDay;
use App\Models\TourActivite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;

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
            'activities.*' => 'exists:activites,id', // Ensure each activity ID exists in the activities table
        ]);

        try {
            // Start a transaction to ensure atomicity
            DB::beginTransaction();

            // Find the TourDay by ID
            $tourDay = TourDay::findOrFail($validated['tour_day_id']);

            // Update the day name
            $tourDay->name = $validated['name'];
            $tourDay->description = $validated['description'];
            $tourDay->save();

            // Remove all existing associations for this day to avoid duplicates
            TourActivite::where('tour_day_id', $validated['tour_day_id'])->delete();

            // Create new associations for the selected activities
            if (!empty($validated['activities'])) {
                foreach ($validated['activities'] as $activityId) {
                    TourActivite::create([
                        'tour_id' => $validated['tour_id'],
                        'tour_day_id' => $validated['tour_day_id'],
                        'activite_id' => $activityId,
                    ]);
                }
            }


            // Commit the transaction
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
        $day = TourDay::with(['activities.activites', 'dayImages'])->find($id);

        if (!$day) {
            return response()->json(['message' => 'Day not found'], 404);
        }
        // Ensure image URLs are full paths
        foreach ($day->dayImages as $image) {
            $image->url = URL::to($image->url); // Make sure the image URL is absolute
        }
    
        // Return the data as JSON for your React frontend
        return response()->json($day);
    }
    
}
