<?php

namespace App\Http\Controllers;

use App\Models\SurveyQuestionGroup;
use App\Models\QuestionGroup;
use App\Models\Survey;
use App\Models\Question;
use App\Models\TrxSurvey;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function getQuestionsBySurveyID($survey_id)
    {
        try {
            $questions = Question::select(
                'mst_survey.survey_id',
                'mst_survey.survey_name',
                'mst_question.question_name',
                'mst_survey_question_group.question_group_id',
                'mst_question_group.question_group_name',
                'mst_question.question_id',
                'mst_question.sequence'
            )
                ->join('mst_survey_question_group', function ($join) {
                    $join
                        ->on(
                            'mst_question.question_group_id',
                            '=',
                            'mst_survey_question_group.question_group_id'
                        )
                        ->on(
                            'mst_question.survey_id',
                            '=',
                            'mst_survey_question_group.survey_id'
                        );
                })
                ->join(
                    'mst_question_group',
                    'mst_survey_question_group.question_group_id',
                    '=',
                    'mst_question_group.question_group_id'
                )
                ->join(
                    'mst_survey',
                    'mst_survey_question_group.survey_id',
                    '=',
                    'mst_survey.survey_id'
                )
                ->where('mst_survey_question_group.survey_id', $survey_id)
                ->orderBy('mst_survey_question_group.sequence')
                ->orderBy('mst_question.sequence')
                ->orderBy('mst_question_group.question_group_name')
                ->get();

            return response()->json($questions, 200);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => 'Failed to retrieve questions for the survey.',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }

    public function getQuestionAnswersBySurveyID($survey_id)
    {
        try {
            $surveyDetails = TrxSurvey::select(
                'trx_survey.trx_id',
                'trx_survey.survey_id',
                'mst_survey.survey_name',
                'trx_survey.question_id',
                'mst_question.question_name',
                'trx_survey.user_answer',
                'trx_survey.company_code',
                'trx_survey.branch_code',
                'trx_survey.customer_code',
                'trx_survey.customer_name',
                'trx_survey.customer_address',
                'trx_survey.outlet_class',
                'trx_survey.kecamatan',
                'trx_survey.survey_datetime'
            )
                ->leftJoin(
                    'mst_survey',
                    'mst_survey.survey_id',
                    '=',
                    'trx_survey.survey_id'
                )
                ->join(
                    'mst_question',
                    'mst_question.question_id',
                    '=',
                    'trx_survey.question_id'
                )
                ->where('trx_survey.survey_id', $survey_id)
                ->orderBy('trx_survey.customer_name')
                ->get();

            return response()->json($surveyDetails, 200);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => 'Failed to retrieve survey details.',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }
}
