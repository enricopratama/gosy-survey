<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Http\Request;

class SurveyController extends Controller
{
    public function index() {
        $surveys = Survey::all();
        return response()->json($surveys);
    }
}
