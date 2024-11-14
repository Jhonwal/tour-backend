<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'name', 'email', 'number_of_persons', 'number_of_rooms', 'tour_id',
    ];

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }
}
