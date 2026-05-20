<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'title', 'description', 'video_url',
        'credits_cost', 'rating', 'instructor_id', 'status'
    ];

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'course_access');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function recommandations()
    {
        return $this->hasMany(Recommandation::class);
    }

    public function media()
    {
        return $this->hasMany(Media::class);
    }

    public function scheduleItems()
    {
        return $this->hasMany(ScheduleItem::class);
    }

    public function chat()
    {
        return $this->hasOne(Chat::class);
    }
}
