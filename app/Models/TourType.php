<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TourType extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'slug', 'description', 'image'];

    public function tours()
    {
        return $this->hasMany(Tour::class);
    }

}
