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
}


