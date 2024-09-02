<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use Illuminate\Validation\Rule;

class QuestionController extends Controller
{
    public function index()
    {
        $questions = Question::all();
        return response()->json($questions);
    }

    public function getQuestions()
    {
        try {
            $questions = Question::select(
                'mst_question.*',
                'mst_question_group.question_group_name AS question_group_name',
                'mst_survey.survey_id AS survey_id',
                'mst_survey.survey_name AS survey_name',
                'mst_survey_question_group.survey_question_id AS survey_question_group_id',
                'mst_survey_question_group.sequence AS survey_question_group_sequence',
                'mst_question_group.data_status AS question_group_data_status',
                'mst_survey.data_status AS survey_data_status',
                'mst_survey_question_group.data_status AS survey_question_group_data_status'
            )
                ->leftJoin(
                    'mst_survey_question_group',
                    'mst_question.question_group_id',
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
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => 'Failed to retrieve questions.',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }

    public function getQuestionsComplete()
    {
        try {
            $questions = Question::with([
                'questionGroup',
                'surveyQuestionGroup.survey',
            ])->get();

            return response()->json($questions);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => 'Failed to retrieve questions.',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }

    public function getQuestionById($question_id)
    {
        $question = Question::find($question_id);
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

    public function getQuestionsBySurveyId($survey_id)
    {
        try {
            $questions = Question::select(
                'mst_question.*',
                'mst_question_group.question_group_name AS question_group_name',
                'mst_survey.survey_id AS survey_id',
                'mst_survey.survey_name AS survey_name',
                'mst_survey_question_group.survey_question_id AS survey_question_group_id',
                'mst_survey_question_group.sequence AS survey_question_group_sequence',
                'mst_question_group.data_status AS question_group_data_status',
                'mst_survey.data_status AS survey_data_status',
                'mst_survey_question_group.data_status AS survey_question_group_data_status'
            )
                ->leftJoin(
                    'mst_survey_question_group',
                    'mst_question.question_group_id',
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
                ->where('mst_survey.survey_id', $survey_id) // Filter by survey_id
                ->get();

            if ($questions->isEmpty()) {
                return response()->json(
                    ['message' => 'No questions found for this survey_id'],
                    404
                );
            }

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

    // public function getQuestionsBySurveyId($survey_id)
    // {
    //     try {
    //         $questions = Question::select(
    //             'mst_question.*',
    //             'mst_survey.survey_id AS survey_id',
    //             'mst_survey.survey_name AS survey_name',
    //             'mst_survey.data_status AS survey_data_status'
    //         )
    //             ->leftJoin(
    //                 'mst_survey',
    //                 'mst_survey.survey_id',
    //                 '=',
    //                 'mst_question.survey_id'
    //             )
    //             ->where('mst_survey.survey_id', $survey_id) // Filter by survey_id
    //             ->get();

    //         if ($questions->isEmpty()) {
    //             return response()->json(
    //                 ['message' => 'No questions found for this survey_id'],
    //                 404
    //             );
    //         }

    //         return response()->json($questions, 200);
    //     } catch (\Exception $e) {
    //         return response()->json(
    //             [
    //                 'error' => 'Failed to retrieve questions for the survey.',
    //                 'message' => $e->getMessage(),
    //             ],
    //             500
    //         );
    //     }
    // }

    /**
     * Store the question in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'question_group_id' => 'required|integer',
            'question_name' => 'required|string|max:255',
            'question_type' => [
                'required',
                Rule::in([
                    'Text',
                    'Paragraph',
                    'Choice',
                    'Checkboxes',
                    'Dropdown',
                ]),
            ],
            'sequence' => 'required|integer',
            'data_status' => 'required|integer',
            'is_parent' => 'required|integer',
            'is_mandatory' => 'required|integer',
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

        $question_key = $request->question_group_id . '#' . $request->sequence;

        DB::beginTransaction();
        try {
            $new = Question::create([
                'question_group_id' => $request->question_group_id,
                'question_name' => $request->question_name,
                'question_key' => $question_key,
                'question_type' => $request->question_type,
                'sequence' => $request->sequence,
                'data_status' => $request->data_status,
                'is_parent' => $request->is_parent,
                'is_mandatory' => $request->is_mandatory,
            ]);

            DB::commit();
            return response()->json(
                [
                    'status' => 1,
                    'message' => "Successfully Saved Question",
                    'data' => $new,
                ],
                200
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'status' => 0,
                    'message' => 'Failed to Save Question',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Update the question in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $question_id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $question_id)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'question_group_id' => 'required|integer',
            'question_name' => 'required|string|max:255',
            'question_type' => [
                'required',
                Rule::in([
                    'Text',
                    'Paragraph',
                    'Choice',
                    'Checkboxes',
                    'Dropdown',
                ]),
            ],
            'sequence' => 'required|integer',
            'data_status' => 'required|integer',
            'is_parent' => 'required|integer',
            'is_mandatory' => 'required|integer',
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

        $question = Question::find($question_id);
        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        $question_key = $request->question_group_id . '#' . $request->sequence;

        $request->merge(['question_key' => $question_key]);

        // Update the current question with the modified request data
        $question->update($request->all());

        return response()->json(
            ['message' => 'Question updated successfully', 'data' => $question],
            200
        );
    }

    /**
     * Remove the question from storage.
     *
     * @param  int  $question_id
     * @return \Illuminate\Http\Response
     */
    public function destroy($question_id)
    {
        $question = Question::find($question_id);
        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        $question->delete();

        return response()->json(
            ['message' => 'Question deleted successfully'],
            200
        );
    }
}
