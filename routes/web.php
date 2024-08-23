<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReactController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\QuestionController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\QuestionGroupController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\SurveyQuestionGroupController;

// Define a route that requires authentication middleware
Route::get('/flights', function () {
    // Only authenticated users may access this route...
    return 'This is a protected route for authenticated users only.';
})->middleware('auth');

// Login and Logout
Route::get('/login', [LoginController::class, 'show'])
    ->name('login')
    ->middleware('guest');
Route::post('/authenticated', [LoginController::class, 'authenticated']);
Route::get('/logout', [LoginController::class, 'logout']);

// Users
Route::get('/api/user', function () {
    return Auth::user();
})->middleware('auth');
Route::get('/users', [UserController::class, 'index'])->name('users');

// Questions
Route::get('/questionsRaw', [QuestionController::class, 'index']);
Route::get('/questions', [QuestionController::class, 'getQuestions']); // original q
Route::get('/questionsComplete', [QuestionController::class, 'getQuestionsComplete']); // updated q
Route::get('/questions/{question_id}', [QuestionController::class, 'getQuestionById',]);
Route::post('/addQuestion', [QuestionController::class, 'store']);
Route::post('/editQuestion/{question_id}', [QuestionController::class, 'update',]);
Route::delete('/deleteQuestion/{question_id}', [QuestionController::class, 'destroy',]);

// Surveys
Route::get('/surveys', [SurveyController::class, 'index']); 
Route::get('/surveys/{survey_name}', [SurveyController::class, 'getBySurveyName']);
Route::post('/addSurvey', [SurveyController::class, 'store']); 
Route::post('/editSurvey/{survey_id}', [SurveyController::class, 'update']); 
Route::delete('/deleteSurvey/{survey_id}', [SurveyController::class, 'destroy']); 

// Question Groups
Route::get('/questionGroups', [QuestionGroupController::class, 'index']); 
Route::get('/questionGroups/{question_group_name}', [QuestionGroupController::class, 'getByQuestionGroup']); 
Route::post('/addQuestionGroup', [QuestionGroupController::class, 'store']); 
Route::post('/editQuestionGroup/{question_group_id}', [QuestionGroupController::class, 'update']);
Route::delete('/deleteQuestionGroup/{question_group_id}', [QuestionGroupController::class, 'destroy']); 

// Survey Question Groups
Route::get('/surveyQuestionGroups', [SurveyQuestionGroupController::class, 'getSurveyQuestionGroups']);
Route::post('/addSurveyQuestionGroup', [SurveyQuestionGroupController::class, 'store']);
Route::post('/editSurveyQuestionGroups/{id}', [SurveyQuestionGroupController::class, 'update']);
Route::delete('/deleteSurveyQuestionGroups/{id}', [SurveyQuestionGroupController::class, 'destroy']);

// Data tables
Route::get('/master-users', [UserController::class, 'getUserAccess']);
Route::get('/master-users/{user_id}', [UserController::class, 'show']);
Route::get('/master-users-by-company', [UserController::class,'getUserAccessByCompany',]);
Route::get('/master-tokens', [UserController::class, 'getAccessToken']);

// All other routes, are defined through React.js
Route::get('/{path?}', [ReactController::class, 'show'])
    ->middleware('auth')
    ->where('path', '.*')
    ->name('react');
