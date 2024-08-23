<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SurveyQuestionGroup;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SurveyQuestionGroupController extends Controller
{
    public function index()
    {
        try {
            $survey_question_group = SurveyQuestionGroup::all();
            return response()->json($survey_question_group);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' =>
                        'Failed to retrieve survey question groups mapping.',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }

    public function getSurveyQuestionGroups()
    {
        try {
            $survey_question_group = SurveyQuestionGroup::select(
                'mst_survey_question_group.*',
                'mst_question_group.question_group_name',
                'mst_question_group.data_status AS question_group_data_status',
                'mst_survey.survey_name',
                'mst_survey.data_status AS survey_data_status'
            )
                ->join(
                    'mst_survey',
                    'mst_survey_question_group.survey_id',
                    '=',
                    'mst_survey.survey_id'
                )
                ->join(
                    'mst_question_group',
                    'mst_survey_question_group.question_group_id',
                    '=',
                    'mst_question_group.question_group_id'
                )
                ->get();

            return response()->json($survey_question_group);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' =>
                        'Failed to retrieve survey question groups mapping.',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'survey_id' => 'required|integer|exists:mst_survey,survey_id',
            'question_group_id' =>
                'required|integer|exists:mst_question_group,question_group_id',
            'sequence' => 'required|integer',
            'data_status' => 'required|integer',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            $messages = ['Oops.. validation error'];
            foreach ($errors->all() as $error) {
                $messages[] = $error;
            }
            return response()->json(
                [
                    'status' => 0,
                    'message' => implode(' | ', $messages),
                    'data' => $errors,
                ],
                500
            );
        }

        DB::beginTransaction();
        try {
            $new = SurveyQuestionGroup::create([
                'survey_id' => $request->survey_id,
                'question_group_id' => $request->question_group_id,
                'sequence' => $request->sequence,
                'data_status' => $request->data_status,
            ]);

            DB::commit();
            return response()->json(
                [
                    'status' => 1,
                    'message' => "Successfully Saved Survey Question Group",
                    'data' => $new,
                ],
                200
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'status' => 0,
                    'message' => 'Failed to Save Survey Question Group',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    public function update(Request $request, $survey_question_id)
    {
        $validator = Validator::make($request->all(), [
            'survey_id' => 'required|integer|exists:mst_survey,survey_id',
            'question_group_id' =>
                'required|integer|exists:mst_question_group,question_group_id',
            'sequence' => 'required|integer',
            'data_status' => 'required|integer',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            $messages = ['Oops.. validation error'];
            foreach ($errors->all() as $error) {
                $messages[] = $error;
            }
            return response()->json(
                [
                    'status' => 0,
                    'message' => implode(' | ', $messages),
                    'data' => $errors,
                ],
                500
            );
        }

        $surveyQuestionGroup = SurveyQuestionGroup::find($survey_question_id);
        if (!$surveyQuestionGroup) {
            return response()->json(
                ['message' => 'Survey Question Group not found'],
                404
            );
        }

        $surveyQuestionGroup->update($request->all());

        return response()->json(
            [
                'message' => 'Survey Question Group updated successfully',
                'data' => $surveyQuestionGroup,
            ],
            200
        );
    }

    public function destroy($survey_question_id)
    {
        $surveyQuestionGroup = SurveyQuestionGroup::find($survey_question_id);
        if (!$surveyQuestionGroup) {
            return response()->json(
                ['message' => 'Survey Question Group not found'],
                404
            );
        }

        $surveyQuestionGroup->delete();

        return response()->json(
            ['message' => 'Survey Question Group deleted successfully'],
            200
        );
    }
}
