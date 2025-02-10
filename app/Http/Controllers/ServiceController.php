<?php

namespace App\Http\Controllers;

use App\Models\Tour;
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
    public function addService(Request $request, $tourId)
    {
        // Validate the request
        $request->validate([
            'type' => 'required|in:include,exclude',
            'services' => 'required|string|max:255',
            'services_description' => 'nullable|string',
        ]);

        // Find the tour
        $tour = Tour::find($tourId);
        if (!$tour) {
            return response()->json(['success' => false, 'message' => 'Tour not found'], 404);
        }

        // Create the new service
        $service = new Service([
            'tour_id' => $tourId,
            'type' => $request->input('type'),
            'services' => $request->input('services'),
            'services_description' => $request->input('services_description'),
        ]);

        // Save the service
        $service->save();

        return response()->json(['success' => true, 'message' => 'Service added successfully', 'data' => $service]);
    }
    public function deleteService($tourId, $serviceId)
    {
        // Find the tour
        $tour = Tour::find($tourId);
        if (!$tour) {
            return response()->json(['success' => false, 'message' => 'Tour not found'], 404);
        }

        // Find the service
        $service = Service::where('id', $serviceId)->where('tour_id', $tourId)->first();
        if (!$service) {
            return response()->json(['success' => false, 'message' => 'Service not found'], 404);
        }

        // Delete the service
        $service->delete();

        return response()->json(['success' => true, 'message' => 'Service deleted successfully']);
    }
}