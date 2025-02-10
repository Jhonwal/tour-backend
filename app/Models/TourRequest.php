<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TourRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name', 'email', 'phone', 'country', 'status',
        'travelers', 'has_children', 'children_count', 'children_ages',
        'duration', 'arrival_date', 'departure_date', 'experience_types',
        'destinations', 'accommodation_type', 'budget_range', 'custom_budget',
        'transportation', 'dietary_preferences', 'additional_services', 'additional_activities', 'other_requests',
    ];

    protected $casts = [
        'children_ages' => 'array',
        'experience_types' => 'array',
        'destinations' => 'array',
        'accommodation_type' => 'array',
        'transportation' => 'array',
        'dietary_preferences' => 'array',
        'additional_services' => 'array',
        'additional_activities' => 'array',
    ];
}
