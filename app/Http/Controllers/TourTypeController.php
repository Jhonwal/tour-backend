<?php

namespace App\Http\Controllers;

use App\Models\TourType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TourTypeController extends Controller
{
    public function index()
    {
        return response()->json(TourType::all());
    }
    public function tour_type()
    {
        // Fetch tour types with the count of tours and paginate
        $tourTypes = TourType::withCount('tours') // Count the related tours
            ->paginate(3); // Paginate the results (3 items per page)

        return response()->json($tourTypes);
    }

    public function show()
    {
        // Fetch data from the `tours` table grouped by `tour_type_id` and join with `tour_types`
        $tourTypes = DB::table('tours')
            ->join('tour_types', 'tours.tour_type_id', '=', 'tour_types.id')
            ->select('tour_types.name as type', DB::raw('COUNT(tours.id) as tours'))
            ->groupBy('tour_types.name')
            ->get()
            ->map(function ($type) {
                return [
                    'type' => $type->type, // Correctly use `type` from `tour_types.name`
                    'tours' => $type->tours,
                    'fill' => '#' . substr(md5($type->type), 0, 6), // Generate a color based on the tour type name
                ];
            });
    
        return response()->json([
            'chartData' => $tourTypes,
        ]);
    }
    
}
