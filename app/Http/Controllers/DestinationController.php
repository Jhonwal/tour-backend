<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    public function store(Request $request)
    {
        // Validation allows 0 nights, ensuring that no destination is excluded.
        $validatedData = $request->validate([
            '*.name' => 'required|string|max:255', // City name must be provided
            '*.number_of_nights' => 'required|integer|min:0', // Nights can be 0
            '*.tour_id' => 'required|exists:tours,id', // Valid tour ID
        ]);

        try {
            // Bulk insert all destinations
            Destination::insert($validatedData);

            return response()->json(['message' => 'Destinations saved successfully!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to save destinations.', 'error' => $e->getMessage()], 500);
        }
    }
    //function new destination using tour id as parametr and number of nights 0
    public function newDestination(Request $request, $tourId)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255', // City name must be provided
        ]);
        $destination = new Destination();
        $destination->tour_id = $tourId;
        $destination->number_of_nights = 0;
        $destination->name = $validatedData['name'];
        $destination->save();
        return response()->json(['message' => 'Destination add successfully!'], 200);
    }
    //function to delet a destination but first chek if the number of nights of this destinition not 0 and add it to another destinition in the same tour id
    public function deleteDestination($destinationId)
    {
        $destination = Destination::find($destinationId);
        
        if ($destination->number_of_nights-1 != 0) {
            $destination2 = Destination::where('tour_id', $destination->tour_id)->first();
            if ($destination2) {
                $destination2->number_of_nights += $destination->number_of_nights;
                $destination2->save();
                $destination->delete();   
                return response()->json(['message' => 'Destination deleted successfully!'], 200);
            } else {
                $destination->delete();
                return response()->json(['message' => 'Destination deleted successfully!'], 200);
            }
        } else {
            $destination->delete();
            return response()->json(['message' => 'Destination deleted successfully!'], 200);
        }
    }
}


