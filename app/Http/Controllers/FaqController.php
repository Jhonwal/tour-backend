<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index() {
        return Faq::where('is_active', true)
            ->orderBy('order')
            ->get();
    }

    public function all() {
        $faq = Faq::orderBy('order')->get();
        $max = Faq::max('order');
        //return
        return response()->json([
            'faq' => $faq,
            'max' => $max
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'is_active' => 'boolean',
            'order' => 'integer'
        ]);

        return Faq::create($validated);
    }

    public function update(Request $request, Faq $faq) {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'is_active' => 'boolean',
            'order' => 'integer'
        ]);

        $faq->update($validated);
        return $faq;
    }

    public function destroy(Faq $faq) {
        $faq->delete();
        return response()->noContent();
    }
}