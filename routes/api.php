<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\MaxIdController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Survey & Questions
Route::get('/questionsRaw', [QuestionController::class, 'index']);
Route::get('/questions', [QuestionController::class, 'getQuestions']);
Route::get('/questions/{question_id}', [
    QuestionController::class,
    'getQuestionById',
]);

Route::get('/survey', [QuestionController::class, 'getSurveyNames']);
Route::get('/questionGroups', [
    QuestionController::class,
    'getQuestionGroupName',
]);

