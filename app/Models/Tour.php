<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tour extends Model
{
    protected $fillable = [
        'name',
        'depart_city',
        'end_city',
        'tour_type',
        'description',
        'map_image',
        'banner',
        'duration',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function destinations()
    {
        return $this->hasMany(Destination::class);
    }

    public function tourActivites()
    {
        return $this->hasMany(TourActivite::class);
    }

    public function tourDays()
    {
        return $this->hasMany(TourDay::class);
    }

    public function tourImages()
    {
        return $this->hasMany(TourImage::class);
    }

    public function tourPrices()
    {
        return $this->hasMany(TourPrice::class);
    }

    public function tourServices()
    {
        return $this->hasMany(Service::class);
    }
}
