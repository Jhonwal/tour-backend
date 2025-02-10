<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Tour;
use App\Models\User;
use App\Models\Booking;
use App\Models\TourType;
use App\Models\Testimonial;
use App\Models\VisitorCount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class AnalyticsController extends Controller
{
    public function getUsers()
    {
        // جلب كافة المستخدمين
        $users = User::select('id', 'name', 'email', 'profile_picture', 'facebook', 'instagram')->get();
        //get the url to the profil using foreach lop
        foreach ($users as $user) {
            $user->profile_picture = URL::to($user->profile_picture);
        }
        return response()->json([
            'users' => $users
        ]);
    }
    public function getAllAnalyticsData()
    {
        try {
            // Visitor count by month
            $visitorCountsByMonth = VisitorCount::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, SUM(count) as total')
                ->groupByRaw('YEAR(created_at), MONTH(created_at)')
                ->orderBy('year', 'asc')
                ->orderBy('month', 'asc')
                ->get();

            // Current month's visitor count by country
            $currentMonthVisitorsByCountry = VisitorCount::selectRaw('country, SUM(count) as total')
                ->groupBy('country')
                ->orderByRaw('SUM(count) DESC')
                ->limit(15)
                ->get();

            // Number of tours by type
            $toursByType = Tour::selectRaw('tour_type_id, COUNT(*) as total')
                ->groupBy('tour_type_id')
                ->with('tourType')
                ->get()
                ->map(function ($item) {
                    return [
                        'tour_type_id' => $item->tour_type_id,
                        'total' => $item->total,
                        'tourType' => $item->tourType ? $item->tourType->only('id', 'name') : null,
                    ];
                });

            // Key metrics overview
            $totalTours = Tour::count();
            $totalBookings = Booking::count();
            $totalVisitors = VisitorCount::sum('count');
            $totalTestimonials = Testimonial::count();
            $totalTourTypes = TourType::count();

            // Users data
            $users = User::select('id', 'name', 'email', 'profile_picture', 'facebook', 'instagram')->get();
            foreach ($users as $user) {
                $user->profile_picture = URL::to($user->profile_picture);
            }

            return response()->json([
                'visitorCountsByMonth' => $visitorCountsByMonth,
                'currentMonthVisitorsByCountry' => $currentMonthVisitorsByCountry,
                'toursByType' => $toursByType,
                'keyMetrics' => [
                    'totalTours' => $totalTours,
                    'totalBookings' => $totalBookings,
                    'totalVisitors' => $totalVisitors,
                    'totalTestimonials' => $totalTestimonials,
                    'totalTourTypes' => $totalTourTypes,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}