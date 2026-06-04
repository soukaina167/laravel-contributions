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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
        $table->string('title');
        $table->text('description');
        $table->string('video_url')->nullable();
        $table->string('video_public_id')->nullable();
        $table->string('playback_url')->nullable();
        $table->integer('credits_cost')->default(0);
        $table->double('rating')->default(0);
        $table->foreignId('instructor_id')->constrained('users')->onDelete('cascade');
        $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
