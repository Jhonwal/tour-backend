<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    protected $fillable = [
        'name', 'number_of_nights', 'tour_id',
    ];

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }
}
