<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReactController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\QuestionController;
use Illuminate\Support\Facades\Auth;

// Define a route that requires authentication middleware
Route::get('/flights', function () {
    // Only authenticated users may access this route...
    return 'This is a protected route for authenticated users only.';
})->middleware('auth');

// Login and Logout:
Route::get('/login', [LoginController::class, 'show'])
    ->name('login')
    ->middleware('guest');

Route::post('/authenticated', [LoginController::class, 'authenticated']);
Route::get('/logout', [LoginController::class, 'logout']);

Route::get('/api/user', function () {
    return Auth::user();
})->middleware('auth');

// Questions:
Route::post('/addQuestion', [QuestionController::class, 'store']);
Route::post('/editQuestion/{question_id}', [QuestionController::class, 'update']);
Route::delete('/deleteQuestion/{question_id}', [QuestionController::class, 'destroy']);

// Users
Route::get('/users', [UserController::class, 'index'])->name('users');

// Data tables
Route::get('/master-users', [UserController::class, 'getUserAccess']);
Route::get('/master-users/{user_id}', [UserController::class, 'show']);
Route::get('/master-users-by-company', [
    UserController::class,
    'getUserAccessByCompany',
]);
Route::get('/master-tokens', [UserController::class, 'getAccessToken']);

// All other routes, are defined through React.js
Route::get('/{path?}', [ReactController::class, 'show'])
    ->middleware('auth')
    ->where('path', '.*')
    ->name('react');
