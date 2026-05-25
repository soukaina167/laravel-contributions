<?php
// routes/api.php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\http\Controllers\Coursecontroller;
use Illuminate\Support\Facades\Route;

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::get('/courses',   [CourseController::class, 'index']);
Route::get('/courses/search', [CourseController::class, 'search']);
Route::get('/courses/{id}',   [CourseController::class, 'show']);

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
    });
});