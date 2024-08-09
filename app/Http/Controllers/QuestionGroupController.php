<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QuestionGroup;

class QuestionGroupController extends Controller
{
    public function index() {
        $questionGroups = QuestionGroup::all();
        return response()->json($questionGroups);
    }
}
