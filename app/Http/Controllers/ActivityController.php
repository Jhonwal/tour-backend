<?php

namespace App\Http\Controllers;

use App\Models\Activite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ActivityController extends Controller
{
    public function index()
    {
        return response()->json(Activite::all());
    }

    /**
     * Store a new activity.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'activity_name' => 'required|string|max:255',
            'activity_description' => 'nullable|string',
        ]);

        $activity = Activite::create($request->all());
        return response()->json($activity, 201);
    }

    /**
     * Get a single activity.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $activity = Activite::findOrFail($id);
        return response()->json($activity);
    }

    /**
     * Update an activity.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'activity_name' => 'required|string|max:255',
            'activity_description' => 'nullable|string',
        ]);

        $activity = Activite::findOrFail($id);
        $activity->update($request->all());
        return response()->json($activity);
    }
    //get activity not exist in a day usig his id
    public function getactivitynotexist($id)
    {
        $activities = DB::table('activites as a')
        ->leftJoin('tour_activites as ta', function ($join) {
            $join->on('a.id', '=', 'ta.activite_id')
                 ->where('ta.tour_day_id', 154);
        })
        ->whereNull('ta.activite_id')
        ->select('a.*')
        ->get();    
        return response()->json($activities);
    }

    /**
     * Delete an activity.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $activity = Activite::findOrFail($id);
        $activity->delete();
        return response()->json(null, 204);
    }
}