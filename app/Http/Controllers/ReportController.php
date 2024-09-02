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
    // public function getAnswersBySurveyID($survey_id)
    // {
    //     try {
    //         $surveyDetails = TrxSurvey::select(
    //             'trx_survey.trx_id',
    //             'trx_survey.survey_id',
    //             'mst_survey.survey_name',
    //             'trx_survey.question_id',
    //             'mst_question.question_name',
    //             'trx_survey.user_answer',
    //             'trx_survey.company_code',
    //             'trx_survey.branch_code',
    //             'trx_survey.customer_code',
    //             'trx_survey.customer_name',
    //             'trx_survey.customer_address',
    //             'trx_survey.outlet_class',
    //             'trx_survey.kecamatan',
    //             'trx_survey.survey_datetime'
    //         )
    //             ->leftJoin(
    //                 'mst_survey',
    //                 'mst_survey.survey_id',
    //                 '=',
    //                 'trx_survey.survey_id'
    //             )
    //             ->join(
    //                 'mst_question',
    //                 'mst_question.question_id',
    //                 '=',
    //                 'trx_survey.question_id'
    //             )
    //             ->where('trx_survey.survey_id', $survey_id)
    //             ->orderBy('trx_survey.customer_name')
    //             ->get();

    //         return response()->json($surveyDetails, 200);
    //     } catch (\Exception $e) {
    //         return response()->json(
    //             [
    //                 'error' => 'Failed to retrieve survey details.',
    //                 'message' => $e->getMessage(),
    //             ],
    //             500
    //         );
    //     }
    // }

    public function getAnswersBySurveyID($survey_id)
    {
        try {
            $surveyDetails = TrxSurvey::select(
                'trx_survey.trx_id',
                'trx_survey.question_id',
                'trx_survey.survey_id',
                'ms.survey_name',
                'gmb.Wilayah AS ASSM',
                'gmb.BranchName AS Branch',
                'trx_survey.company_code',
                'trx_survey.branch_code',
                'trx_survey.survey_datetime',
                'mu.salesman_code',
                'mu.account_name AS salesman_name',
                'trx_survey.customer_code',
                'trx_survey.customer_name',
                'trx_survey.customer_address',
                'trx_survey.outlet_class',
                'trx_survey.kecamatan',
                'mst_question.question_name',
                'trx_survey.user_answer'
            )
                ->leftJoin(
                    'mst_user as mu',
                    'trx_survey.user_id',
                    '=',
                    'mu.user_id'
                )
                ->leftJoin(
                    'mst_survey as ms',
                    'ms.survey_id',
                    '=',
                    'trx_survey.survey_id'
                )
                ->leftJoin('gpd_mst_branch as gmb', function ($join) {
                    $join
                        ->on('gmb.companyCode', '=', 'trx_survey.company_code')
                        ->on('gmb.branchCode', '=', 'trx_survey.branch_code');
                })
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
