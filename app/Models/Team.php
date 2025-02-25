<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $table = 'teams';

    protected $fillable = [
        'name',
        'email',
        'phone_number',
        'profile_picture',
        'facebook',
        'instagram',
        'role',
        'bio'
    ];
}
