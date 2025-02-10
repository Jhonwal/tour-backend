<?php

namespace App\Http\Controllers;

use App\Models\Tour;
use App\Models\Promotion;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class PromotionController extends Controller
{
    public function index()
    {
        return Promotion::with('tours')->get();
    }
    //index frontend
    public function indexFrontend()
    {
        $today = date('Y-m-d');
        return  Promotion::with('tours')
                ->where('start_date', '<=', $today)
                ->where('end_date', '>=', $today)
                ->get()->map(function ($promotion) {
                $promotion->tours->transform(function ($tour) {
                    $tour->banner = URL::to($tour->banner);
                    $tour->map_image = URL::to($tour->map_image);
                    return $tour;
                });
            return $promotion;
        });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'discount_value' => 'required|numeric',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'tour_ids' => 'required|array'
        ]);
        //add slug 
        $validated['slug'] = Str::slug($validated['title']);

        $promotion = Promotion::create($validated);
        $promotion->tours()->attach($request->tour_ids);

        return response()->json($promotion->load('tours'), 201);
    }

    public function update(Request $request, Promotion $promotion)
    {
        if (now()->gt($promotion->end_date)) {
            return response()->json(['message' => 'Cannot update expired promotion'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'discount_value' => 'required|numeric',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'tour_ids' => 'required|array'
        ]);
        //add slug
        $validated['slug'] = Str::slug($validated['title']);

        $promotion->update($validated);
        $promotion->tours()->sync($request->tour_ids);

        return response()->json($promotion->load('tours'));
    }

    public function destroy(Promotion $promotion)
    {
        $promotion->tours()->detach();
        $promotion->delete();
        return response()->json(null, 204);
    }
}