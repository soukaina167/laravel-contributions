<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $fillable = ['url', 'type', 'review_id', 'course_id'];

    public function review()
    {
        return $this->belongsTo(Review::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
