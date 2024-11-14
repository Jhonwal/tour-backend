<?php

namespace App\Http\Controllers;

use App\Models\VisitorCount;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VisitorCountController extends Controller
{
    public function trackVisitor(Request $request)
    {
        $country = $request->input('country');

        // Debugging: Check if country is being received
        if (!$country) {
            return response()->json(['error' => 'Country is required'], 400);
        }

        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        $visitor = VisitorCount::where('month', $currentMonth)
            ->where('year', $currentYear)
            ->where('country', $country)
            ->first();

        if ($visitor) {
            $visitor->increment('count');
        } else {
            VisitorCount::create([
                'month' => $currentMonth,
                'year' => $currentYear,
                'country' => $country,
                'count' => 1,
            ]);
        }

        return response()->json(['message' => 'Visitor tracked successfully']);
    }

    public function getTopCountries()
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;
        $previousMonth = $currentMonth === 1 ? 12 : $currentMonth - 1;
        $previousYear = $currentMonth === 1 ? $currentYear - 1 : $currentYear;

        // Current month data
        $visitorDataCurrent = DB::table('visitor_counts')
            ->select('country', 'count')
            ->where('month', $currentMonth)
            ->where('year', $currentYear)
            ->orderByDesc('count')
            ->get();

        // Previous month data
        $visitorDataPrevious = DB::table('visitor_counts')
            ->select('country', 'count')
            ->where('month', $previousMonth)
            ->where('year', $previousYear)
            ->orderByDesc('count')
            ->get();

        // Process top 5 countries and aggregate others for current month
        $topCountriesCurrent = $visitorDataCurrent->take(5);
        $otherCountriesTotalCurrent = $visitorDataCurrent->skip(5)->sum('count');

        $colors = ["#FF5733", "#33FF57", "#3357FF", "#F5FF33", "#FF33A1", "#33FFF6", "#FF8C00", "#8A2BE2", "#A52A2A", "#5F9EA0", "#D2691E", "#FF4500", "#2E8B57", "#FFD700", "#DA70D6"];

        // Create chart data for current month
        $chartData = $topCountriesCurrent->map(function ($item) use (&$colors) {
            return [
                'country' => $item->country,
                'visitors' => $item->count,
                'fill' => array_shift($colors),
            ];
        })->toArray();

        if ($otherCountriesTotalCurrent > 0) {
            $chartData[] = [
                'country' => 'Others',
                'visitors' => $otherCountriesTotalCurrent,
                'fill' => array_shift($colors),
            ];
        }

        // Calculate total visitors for the current month
        $totalVisitorsCurrent = $visitorDataCurrent->sum('count');

        // Calculate total visitors for the previous month
        $totalVisitorsPrevious = $visitorDataPrevious->sum('count');

        $defferentBetweenMonths = $totalVisitorsCurrent - $totalVisitorsPrevious;
        // Calculate the percentage change
        $percentageChange = 0;
        if ($totalVisitorsPrevious > 0) {
            $percentageChange = (($totalVisitorsCurrent - $totalVisitorsPrevious) / $totalVisitorsPrevious) * 100;
        }

        return response()->json([
            'chartData' => $chartData,
            'percentageChange' => $percentageChange,
            'deferent' => $defferentBetweenMonths ,
        ]);
    }

}

