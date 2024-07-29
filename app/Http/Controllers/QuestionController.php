<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;
use App\Models\QuestionGroup;
use App\Models\Survey;
use App\Models\SurveyQuestionGroup;

class QuestionController extends Controller
{
    public function index()
    {
        $questions = Question::all();
        return response()->json($questions);
    }

    /**
     * Gets all the questions alongside their headers (question or survey types)
     */
    public function getQuestions()
    {
        $questions = Question::select(
            'mst_question_ori.*',
            'mst_question_group.*',
            'mst_survey.*',
            'mst_survey_question_group.*'
        )
            ->leftJoin(
                'mst_survey_question_group',
                'mst_question_ori.question_group_id',
                '=',
                'mst_survey_question_group.question_group_id'
            )
            ->leftJoin(
                'mst_survey',
                'mst_survey_question_group.survey_id',
                '=',
                'mst_survey.survey_id'
            )
            ->leftJoin(
                'mst_question_group',
                'mst_survey_question_group.question_group_id',
                '=',
                'mst_question_group.question_group_id'
            )
            ->get();

        return response()->json($questions);
    }

    public function getSurveyNames()
    {
        $questions = Survey::all();
        return response()->json($questions);
    }
}
