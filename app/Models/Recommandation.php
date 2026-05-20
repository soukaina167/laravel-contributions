<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Recommandation extends Model
{
    protected $fillable = ['user_id', 'course_id', 'score'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
