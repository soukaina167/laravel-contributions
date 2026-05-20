<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'user_id', 'plan', 'status',
        'starts_at', 'ends_at', 'payment_reference'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
