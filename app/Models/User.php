<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use App\Models\Role;
use App\Models\Skill;
use App\Models\Course;
use App\Models\Review;
use App\Models\Subscription;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'credits',
        'reputation_score',
        'role_id',
        'is_banned'
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    // Relations
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'user_skills');
    }

    // Cours créés par l'utilisateur (en tant qu'instructeur)
    public function courses()
    {
        return $this->hasMany(Course::class, 'instructor_id');
    }

    // Cours accessibles via la table pivot course_access
    public function accessibleCourses()
    {
        return $this->belongsToMany(Course::class, 'course_access');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class);
    }

    // Helpers
    public function isAdmin()
    {
        return $this->role && $this->role->name === 'admin';
    }

    public function isPremium()
    {
        return $this->role && $this->role->name === 'premium';
    }
}