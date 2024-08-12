<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QuestionGroup;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class QuestionGroupController extends Controller
{
    public function index() {
        $questionGroups = QuestionGroup::all();
        return response()->json($questionGroups);
    }

    public function getByQuestionGroup($question_group_name) {
        $question = QuestionGroup::where('question_group_name', $question_group_name)->first();
        if (!empty($question)) {
            return response()->json($question);
        } else {
            return response()->json(
                [
                    'message' => 'question not found',
                ],
                404
            );
        }
        
    }
}
