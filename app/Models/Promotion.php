<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'slug',
        'discount_value',
        'start_date',
        'end_date',
    ];

    public function tours()
    {
        return $this->belongsToMany(Tour::class, 'promotion_tour');
    }
}
