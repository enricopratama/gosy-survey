<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuestionGroupController;
use App\Http\Controllers\SurveyController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
