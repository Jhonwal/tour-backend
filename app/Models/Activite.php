<?php

namespace App\Models;

use App\Models\TourActivite;
use Illuminate\Database\Eloquent\Model;

class Activite extends Model
{
    protected $fillable = [
        'activity_name', 'activity_description',
    ];
    public function tourActivites()
    {
        return $this->hasMany(TourActivite::class);
    }

    public function tours()
    {
        return $this->belongsToMany(Tour::class, 'tour_activites', 'activite_id', 'tour_id');
    }
}
