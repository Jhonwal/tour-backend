<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function store(Request $request)
    {
        // Validation allows services to have empty descriptions and accept type 'include' or 'exclude'
        $validatedData = $request->validate([
            '*.services' => 'required|string|max:255', // Service name is required
            '*.services_description' => 'nullable|string|max:1000', // Description is optional
            '*.type' => 'required|in:include,exclude', // Type must be either 'include' or 'exclude'
            '*.tour_id' => 'required|exists:tours,id', // Valid tour ID
        ]);

        try {
            // Bulk insert services
            Service::insert($validatedData);

            return response()->json(['message' => 'Services saved successfully!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to save services.', 'error' => $e->getMessage()], 500);
        }
    }
}
