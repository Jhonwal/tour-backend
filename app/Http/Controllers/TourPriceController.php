<?php
// app/Http/Controllers/TourPriceController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TourPrice;

class TourPriceController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            '3-stars|2' => 'required|numeric',
            '4-stars|2' => 'required|numeric',
            '4&5-stars|2' => 'required|numeric',
            '5-stars|2' => 'required|numeric',
            '3-stars|3-4' => 'required|numeric',
            '4-stars|3-4' => 'required|numeric',
            '4&5-stars|3-4' => 'required|numeric',
            '5-stars|3-4' => 'required|numeric',
            '3-stars|5<n' => 'required|numeric',
            '4-stars|5<n' => 'required|numeric',
            '4&5-stars|5<n' => 'required|numeric',
            '5-stars|5<n' => 'required|numeric',
            'tour_id' => 'required|exists:tours,id',
        ]);

        // Create a new tour price record
        try {
            $tourPrice = TourPrice::create([
                '3-stars|2' => $validated['3-stars|2'],
                '4-stars|2' => $validated['4-stars|2'],
                '4&5-stars|2' => $validated['4&5-stars|2'],
                '5-stars|2' => $validated['5-stars|2'],
                '3-stars|3-4' => $validated['3-stars|3-4'],
                '4-stars|3-4' => $validated['4-stars|3-4'],
                '4&5-stars|3-4' => $validated['4&5-stars|3-4'],
                '5-stars|3-4' => $validated['5-stars|3-4'],
                '3-stars|5<n' => $validated['3-stars|5<n'],
                '4-stars|5<n' => $validated['4-stars|5<n'],
                '4&5-stars|5<n' => $validated['4&5-stars|5<n'],
                '5-stars|5<n' => $validated['5-stars|5<n'],
                'tour_id' => $validated['tour_id'],
            ]);

            // Return a successful response with the created data
            return response()->json([
                'message' => 'Tour prices successfully added.',
                'data' => $tourPrice,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while saving the tour price.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}