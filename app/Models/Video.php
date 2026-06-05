<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'url',
        'description',
        'course_id',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
