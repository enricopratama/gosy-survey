<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReactController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoginController;

// Example route for counting
Route::post('count', function (Request $request) {
    return response()->json([
        'message' => $request->message,
    ]);
});
Route::get('/test', function (Request $request) {
    return view('home');
});

// Define a route that requires authentication middleware
Route::get('/flights', function () {
    // Only authenticated users may access this route...
    return 'This is a protected route for authenticated users only.';
})->middleware('auth'); // Middleware

// Login and Logout:
Route::get('/login', [LoginController::class, 'show'])
    ->name('login')
    ->middleware('guest');

Route::post('/authenticated', [LoginController::class, 'authenticated']);
Route::get('/logout', [LoginController::class, 'logout']);

// Sidebar Testing
Route::view('/sidebar', 'sidebar');
Route::view('/sidebarCI', 'sidebarCI');

// Alias for /users to be named as users only
Route::get('/users', [UserController::class, 'show'])->name('users');
// Route::get('/app', [UserController::class, 'show'])->name('users');

// All other routes, are defined through React.js
Route::get('/{path?}', [ReactController::class, 'show'])
    ->middleware('auth')
    ->where('path', '.*')
    ->name('react');
