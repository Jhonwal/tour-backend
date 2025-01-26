<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VisitorCount;
use App\Models\Tour;
use App\Models\Booking;
use App\Models\Testimonial;
use App\Models\TourType;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    // Visitor count by month
    public function getVisitorCountByMonth()
    {
        try {
            $visitorCounts = VisitorCount::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, SUM(count) as total')
                ->groupByRaw('YEAR(created_at), MONTH(created_at)')
                ->orderBy('year', 'asc')
                ->orderBy('month', 'asc')
                ->get();

            return response()->json($visitorCounts);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Current month's visitor count by country
    public function getCurrentMonthVisitorsByCountry()
    {
        try {
            // Get the top 15 countries by total visitor count
            $visitorCounts = VisitorCount::selectRaw('country, SUM(count) as total')
                ->groupBy('country')
                ->orderByRaw('SUM(count) DESC')
                ->limit(15)
                ->get();
    
            if ($visitorCounts->isEmpty()) {
                return response()->json(['message' => 'No data available for the current month'], 404);
            }
    
            return response()->json($visitorCounts);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    

    // Number of tours by type
    public function getToursByType()
    {
        try {
            $toursByType = Tour::selectRaw('tour_type_id, COUNT(*) as total')
                ->groupBy('tour_type_id')
                ->with('tourType') // Ensure this relationship exists
                ->get()
                ->map(function ($item) {
                    return [
                        'tour_type_id' => $item->tour_type_id,
                        'total' => $item->total,
                        'tourType' => $item->tourType ? $item->tourType->only('id', 'name') : null,
                    ];
                });

            return response()->json($toursByType);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Key metrics overview
    public function getKeyMetrics()
    {
        try {
            $totalTours = Tour::count();
            $totalBookings = Booking::count();
            $totalVisitors = VisitorCount::sum('count');
            $totalTestimonials = Testimonial::count();
            $totalTourTypes = TourType::count();

            return response()->json([
                'totalTours' => $totalTours,
                'totalBookings' => $totalBookings,
                'totalVisitors' => $totalVisitors,
                'totalTestimonials' => $totalTestimonials,
                'totalTourTypes' => $totalTourTypes,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}