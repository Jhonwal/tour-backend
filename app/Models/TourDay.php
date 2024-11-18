<?php

namespace App\Models;

use App\Models\DayImage;
use Illuminate\Database\Eloquent\Model;

class TourDay extends Model
{
    protected $fillable = [
        'name', 'number', 'description', 'tour_id',
    ];

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }

    public function tourActivites()
    {
        return $this->hasMany(TourActivite::class);
    }
    public function dayImages()
    {
        return $this->hasMany(DayImage::class);
    }
}
