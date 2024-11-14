<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'name' => 'required|string',
            'number_of_nights' => 'required|integer|min:1',
            'tour_id' => 'required|integer|exists:tours,id',
        ]);

        // Create a new record in the database
        $destination = Destination::create($validatedData);

        // Return a success response
        return response()->json([
            'message' => 'Destination created successfully!',
            'data' => $destination
        ], 201);
    }
}



