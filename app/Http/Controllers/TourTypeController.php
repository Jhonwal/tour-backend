<?php

namespace App\Http\Controllers;

use App\Models\TourType;
use Illuminate\Http\Request;

class TourTypeController extends Controller
{
    public function index()
    {
        return response()->json(TourType::all());
    }
}
