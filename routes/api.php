// routes/api.php
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\CourseAccessController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\SearchController;
// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::get('/courses',   [CourseController::class, 'index']);
Route::get('/courses/search', [CourseController::class, 'search']);
Route::get('/courses/{id}',   [CourseController::class, 'show']);
Route::get('/search', [SearchController::class, 'search']);
// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
    // Cours
    Route::post('/courses',         [CourseController::class, 'store']);
    Route::put('/courses/{id}',     [CourseController::class, 'update']);
    Route::delete('/courses/{id}',  [CourseController::class, 'destroy']);
    Route::get('/my-courses',       [CourseController::class, 'myCourses']);

    // Admin
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/pending-videos',          [AdminController::class, 'pendingVideos']);
        Route::post('/validate-video/{id}',    [AdminController::class, 'validateVideo']);
        Route::post('/reject-video/{id}',      [AdminController::class, 'rejectVideo']);
        Route::post('/ban-user/{id}',          [AdminController::class, 'banUser']);
        Route::post('/unban-user/{id}',        [AdminController::class, 'unbanUser']);
        Route::get('/statistics',              [AdminController::class, 'statistics']);
        Route::get('/users',                   [AdminController::class, 'users']);
        Route::get('/skills',         [AdminController::class, 'getSkills']);
        Route::post('/skills',        [AdminController::class, 'createSkill']);
        Route::delete('/skills/{id}', [AdminController::class, 'deleteSkill']);
    });
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
    // Forum
    Route::get('/courses/{id}/forum',              [ForumController::class, 'index']);
    Route::post('/courses/{id}/forum',             [ForumController::class, 'store']);
    Route::post('/forum/messages/{id}/reply',      [ForumController::class, 'reply']);
    Route::delete('/forum/messages/{id}',          [ForumController::class, 'destroy']);
});