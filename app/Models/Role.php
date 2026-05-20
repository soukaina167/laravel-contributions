<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Role;

class User extends Authenticatable
{
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}