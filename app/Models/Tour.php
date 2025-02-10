<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tour extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'depart_city',
        'end_city',
        'tour_type_id',
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

    public function price()
    {
        return $this->hasOne(TourPrice::class);
    }
    
    public function tourServices()
    {
        return $this->hasMany(Service::class);
    }
    public function tourType()
    {
        return $this->belongsTo(TourType::class);
    }
    public function includedServices()
    {
        return $this->hasMany(Service::class)->where('type', 'include');
    }

    public function excludedServices()
    {
        return $this->hasMany(Service::class)->where('type', 'exclude');
    }
    public function promotions()
    {
        return $this->belongsToMany(Promotion::class, 'promotion_tour');
    }
}
