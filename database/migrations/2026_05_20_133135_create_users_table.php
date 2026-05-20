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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
        $table->string('name');
        $table->string('email')->unique();
        $table->string('password');
        $table->integer('credits')->default(0);
        $table->double('reputation_score')->default(0);
        $table->foreignId('role_id')->default(2)->constrained('roles');
        $table->boolean('is_banned')->default(false);
        $table->timestamp('email_verified_at')->nullable();
        $table->rememberToken();
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
