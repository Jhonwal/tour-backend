<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'country',
        'region',
        'number_of_adults',
        'number_of_children',
        'number_of_rooms',
        'arrival_date',
        'tour_level',
        'special_requests',
        'status',
        'total_price',
        'discount',
        'reference_code',
        'tour_id',
    ];

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }
}
