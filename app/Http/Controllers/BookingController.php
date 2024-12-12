<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\TourPrice;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'country' => 'required|string|max:255',
            'region' => 'required|string|max:255',
            'number_of_adults' => 'required|integer|min:1',
            'number_of_children' => 'nullable|integer|min:0',
            'number_of_rooms' => 'required|integer|min:1',
            'arrival_date' => 'required|date|after:today',
            'tour_level' => 'required|in:3-stars,4-stars,4&5-stars,5-stars',
            'special_requests' => 'nullable|string',
            'tour_id' => 'required|exists:tours,id',
        ]);
    
        try {
            $total_people = $validated['number_of_adults'] + ($validated['number_of_children'] ?? 0);
    
            if ($total_people <= 2) {
                $price_category = $validated['tour_level'].'|2';
            } elseif ($total_people <= 4) {
                $price_category = $validated['tour_level'].'|3-4';
            } else {
                $price_category = $validated['tour_level']."|5<n";
            }
    
            $tour_price = TourPrice::where('tour_id', $validated['tour_id'])->first();
    
            if (!$tour_price || !isset($tour_price->$price_category)) {
                return response()->json([
                    'message' => 'Price not found for the selected tour level and group size.',
                ], 404);
            }
    
            $price = $tour_price->$price_category;
    
            $total_price = $price * $total_people;
    
            $booking = Booking::create([
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'country' => $validated['country'],
                'region' => $validated['region'],
                'number_of_adults' => $validated['number_of_adults'],
                'number_of_children' => $validated['number_of_children'] ?? 0,
                'number_of_rooms' => $validated['number_of_rooms'],
                'arrival_date' => $validated['arrival_date'],
                'tour_level' => $validated['tour_level'],
                'special_requests' => $validated['special_requests'] ?? null,
                'status' => 'pending',
                'total_price' => $total_price, 
                'discount' => 0,
                'reference_code' => strtoupper(Str::random(10)),
                'tour_id' => $validated['tour_id'],
            ]);
    
            return response()->json([
                'message' => 'Booking created successfully!',
                'data' => $booking,
                'reference_code' => $booking->reference_code,  
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while creating the booking.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function checkBooking(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'reference_code' => 'required|string|max:255',
        ]);

        $booking = Booking::where('email', $validated['email'])
                        ->where('reference_code', $validated['reference_code'])
                        ->with('tour')
                        ->first();
        // Assuming 'tour' is a relationship in the Booking model
        $tour = $booking->tour;
        
        // Append the image URLs dynamically
        $booking->tour->banner = URL::to($tour->banner);
        $booking->tour->map_image = URL::to($tour->map_image);

        if ($booking) {
            return response()->json([
                'message' => 'Booking found!',
                'data' => $booking,
            ], 200);
        }

        return response()->json([
            'message' => 'No booking found for the provided details.',
        ], 404);
    }
    // Fetch all bookings with optional filtering
    public function index(Request $request)
    {
        $query = Booking::query();

        $bookings = $query->get();

        // Count status types
        $statusCounts = [
            'pending' => $bookings->where('status', 'pending')->count(),
            'confirmed' => $bookings->where('status', 'confirmed')->count(),
            'canceled' => $bookings->where('status', 'canceled')->count(),
            'completed' => $bookings->where('status', 'completed')->count(),
        ];

        return response()->json([
            'data' => $bookings,
            'status_counts' => $statusCounts
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,confirmed,canceled,completed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $booking = Booking::findOrFail($id);
        $booking->update(['status' => $request->status]);

        return response()->json(['message' => 'Booking updated successfully', 'data' => $booking]);
    }

    // Delete a booking
    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json(['message' => 'Booking deleted successfully']);
    }
}
