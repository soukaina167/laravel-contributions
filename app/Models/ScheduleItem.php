<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ScheduleItem extends Model
{
    protected $fillable = [
        'schedule_id', 'course_id',
        'planned_date', 'duration', 'status'
    ];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
