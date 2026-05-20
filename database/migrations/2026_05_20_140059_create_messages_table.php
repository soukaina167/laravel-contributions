<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
                   $table->id();
        $table->string('sender_type');
        $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade');
        $table->text('content');
        $table->timestamp('timestamp')->useCurrent();
        $table->foreignId('chat_id')->constrained()->onDelete('cascade');
        $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
