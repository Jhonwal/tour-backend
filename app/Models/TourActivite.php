<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TourActivite extends Model
{
    protected $fillable = [
        'tour_id', 'tour_day_id', 'activite_id',
    ];

    public function activite()
    {
        return $this->belongsTo(Activite::class);
    }

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }

    public function tourDay()
    {
        return $this->belongsTo(TourDay::class);
    }
}
