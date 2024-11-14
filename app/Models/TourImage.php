<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TourImage extends Model
{
    protected $fillable = [
        'url', 'tour_id',
    ];

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }
}
