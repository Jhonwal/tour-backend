<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'services', 'services_description', 'type',
    ];
    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }
}
