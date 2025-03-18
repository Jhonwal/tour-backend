<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TourPrice extends Model
{
    protected $fillable = [
        '3-stars|2', 
        '4-stars|2', 
        '4&5-stars|2', 
        '5-stars|2',
        '3-stars|3-4', 
        '4-stars|3-4', 
        '4&5-stars|3-4', 
        '5-stars|3-4',        
        'tour_id',
    ];

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }
}
