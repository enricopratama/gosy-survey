<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuestionGroupController;
use App\Http\Controllers\SurveyController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Questions
Route::get('/questionsRaw', [QuestionController::class, 'index']);
Route::get('/questions', [QuestionController::class, 'getQuestions']);
Route::get('/questions/{question_id}', [
    QuestionController::class,
    'getQuestionById',
]);

// Surveys
Route::get('/survey', [SurveyController::class, 'index']);

// Question Groupss
Route::get('/questionGroups', [QuestionGroupController::class, 'index']);

Route::get('/questionGroups/{question_group_id}', [
    QuestionGroupController::class,
    'getByQuestionGroup',
]);
