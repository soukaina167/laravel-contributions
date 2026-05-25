// routes/api.php
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\CourseAccessController;
// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Profil
    Route::get('/profile',       [ProfileController::class, 'show']);
    Route::put('/profile',       [ProfileController::class, 'update']);
    Route::get('/profile/quota', [ProfileController::class, 'quota']);

    // Abonnement
    Route::get('/subscription',    [SubscriptionController::class, 'show']);
    Route::post('/subscription',   [SubscriptionController::class, 'store']);
    Route::delete('/subscription', [SubscriptionController::class, 'cancel']);

    // Avis
    Route::get('/courses/{id}/reviews',  [ReviewController::class, 'index']);
    Route::post('/courses/{id}/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{id}',          [ReviewController::class, 'update']);
    // Accès cours
    Route::post('/courses/{id}/access',  [CourseAccessController::class, 'access']);
    Route::get('/my-accessible-courses', [CourseAccessController::class, 'myCourses']);

    // Notes et ressources
    Route::get('/courses/{id}/notes',       [NoteController::class, 'index']);
    Route::post('/courses/{id}/notes',      [NoteController::class, 'store']);
    Route::delete('/notes/{id}',            [NoteController::class, 'destroy']);
    Route::get('/notes/{id}/download',      [NoteController::class, 'download']);
});