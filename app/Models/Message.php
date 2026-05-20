<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'sender_type', 'receiver_id',
        'content', 'timestamp', 'chat_id'
    ];

    public function chat()
    {
        return $this->belongsTo(Chat::class);
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
