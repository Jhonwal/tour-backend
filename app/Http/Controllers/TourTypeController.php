<?php

namespace App\Http\Controllers;

use App\Models\TourType;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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

    public function shartShow()
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
    public function show($id)
    {
        $tourType = TourType::find($id);
    
        if (!$tourType) {
            return response()->json(['message' => 'Tour type not found'], 404);
        }
    
        return response()->json($tourType);
    }

    public function tours(TourType $tourType)
    {
        return $tourType->tours;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $imagePath = $request->file('image')->store('tour-types', 'public');

        $tourType = TourType::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'image' => "/storage/" . $imagePath
        ]);

        return response()->json($tourType, 201);
    }

    public function update(Request $request, TourType $tourType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            $oldPath = str_replace('/storage/', '', $tourType->image);
            Storage::disk('public')->delete($oldPath);
            
            // Store new image
            $imagePath = $request->file('image')->store('tour-types', 'public');
            $tourType->image = "/storage/" . $imagePath;
        }

        $tourType->name = $validated['name'];
        $tourType->slug = Str::slug($validated['name']);
        $tourType->description = $validated['description'];
        $tourType->save();

        return response()->json($tourType);
    }

    public function destroy(TourType $tourType)
    {
        // Delete image
        $imagePath = str_replace('/storage/', '', $tourType->image);
        Storage::disk('public')->delete($imagePath);

        $tourType->delete();
        return response()->json(null, 204);
    }
}
