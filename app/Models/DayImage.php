<?php

namespace App\Models;

use App\Models\TourDay;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DayImage extends Model
{
    use HasFactory;
    protected $fillable = [
        'url', 'day_id',
    ];

    public function tourDay()
    {
        return $this->belongsTo(TourDay::class);
    }
}
