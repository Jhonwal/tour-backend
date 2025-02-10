<?php

namespace App\Http\Controllers;

use App\Models\TourRequest;
use Illuminate\Http\Request;
use App\Mail\TourRequestEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class TourRequestController extends Controller
{
    /**
     * Store a new tour request.
     */
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'travelers' => 'required|integer|min:1',
            'has_children' => 'required|boolean',
            'children_count' => 'nullable|integer|min:0',
            'children_ages' => 'nullable|array', // Ensure it's an array
            'duration' => 'required|integer|min:1',
            'arrival_date' => 'required|date',
            'departure_date' => 'required|date|after_or_equal:arrival_date',
            'experience_types' => 'required|array', // Ensure it's an array
            'destinations' => 'required|array', // Ensure it's an array
            'accommodation_type' => 'required|array',
            'budget_range' => 'required|string', // Ensure it's an array
            'custom_budget' => 'nullable|string',
            'transportation' => 'required|array', // Ensure it's an array
            'dietary_preferences' => 'nullable|array', // Ensure it's an array
            'additional_services' => 'nullable|array', // Ensure it's an array
            'additional_activities'=> 'nullable|array',
            'other_requests' => 'nullable|string',
        ]);

        // Encode array fields to JSON
        $validatedData['children_ages'] = json_encode($validatedData['children_ages'] ?? []);
        $validatedData['experience_types'] = json_encode($validatedData['experience_types']);
        $validatedData['destinations'] = json_encode($validatedData['destinations']);
        $validatedData['transportation'] = json_encode($validatedData['transportation']);
        $validatedData['dietary_preferences'] = json_encode($validatedData['dietary_preferences'] ?? []);
        $validatedData['additional_services'] = json_encode($validatedData['additional_services'] ?? []);
        $validatedData['additional_activities'] = json_encode($validatedData['additional_activities'] ?? []);
        $validatedData['accommodation_type'] = json_encode($validatedData['accommodation_type']);

        // Create and save the new tour request
        $tourRequest = TourRequest::create($validatedData);

        // Return a JSON response
        return response()->json([
            'message' => 'Tour request created successfully!',
            'data' => $tourRequest
        ], 201);
    }
    public function index()
    {
        $requests = TourRequest::latest()->get();
        return response()->json($requests);
    }

    /**
     * Update the status of a tour request.
     */
    public function updateStatus(Request $request, TourRequest $tourRequest)
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required', 'string', 'in:pending,approved,rejected'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $tourRequest->update(['status' => $request->status]);
        
        return response()->json([
            'message' => 'Status updated successfully',
            'status' => $tourRequest->status
        ]);
    }

    /**
     * Send email to tour request applicant.
     */
    public function sendEmail(Request $request, TourRequest $tourRequest)
    {
        $validator = Validator::make($request->all(), [
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            Mail::to($tourRequest->email)
                ->send(new TourRequestEmail(
                    $tourRequest,
                    $request->subject,
                    $request->message
                ));

            return response()->json([
                'message' => 'Email sent successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send email',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}