<?php


// app/Models/Post.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Post extends Model
{
    protected $fillable = [
        'title', 'slug', 'excerpt', 'content', 
        'featured_image', 'category_id', 
        'user_id', 'published_at', 
        'is_featured', 'views'
    ];

    protected $dates = ['published_at', 'created_at', 'updated_at'];

    protected $appends = ['reading_time'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            $post->slug = Str::slug($post->title);
            $post->excerpt = Str::limit(strip_tags($post->content), 150);
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getReadingTimeAttribute()
    {
        $words = str_word_count(strip_tags($this->content));
        return ceil($words / 200); // Avg reading time
    }
}