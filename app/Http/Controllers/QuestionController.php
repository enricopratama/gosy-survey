<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

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

    /**
     * Store the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'question_group_id' => 'required|integer',
            'question_name' => 'required|string|max:255',
            'question_key' => 'required|string|max:255',
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
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            $messages = ['Validation Error!'];
            foreach ($errors->all() as $error) {
                $messages[] = $error;
            }
            return response()->json(
                [
                    'status' => 0,
                    'message' => implode(' | ', $messages),
                    'data' => $errors,
                ],
                200
            );
        }

        // Insert into database
        DB::beginTransaction();
        try {
            $new = Question::create([
                'question_group_id' => $request->question_group_id,
                'question_name' => $request->question_name,
                'question_key' => $request->question_key,
                'question_type' => $request->question_type,
                'sequence' => $request->sequence,
                'status' => $request->status,
                'data_status' => $request->data_status,
            ]);

            DB::commit();
            return response()->json(
                [
                    'status' => 1,
                    'message' => "Successfully Saved",
                    'data' => $new,
                ],
                200
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'status' => 0,
                    'message' => 'Failed to Save',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'question_group_id' => 'required|integer',
            'question_name' => 'required|string|max:255',
            'question_key' => 'required|string|max:255',
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
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            $messages = ['Validation Error!'];
            foreach ($errors->all() as $error) {
                $messages[] = $error;
            }
            return response()->json(
                [
                    'status' => 0,
                    'message' => implode(' | ', $messages),
                    'data' => $errors,
                ],
                200
            );
        }

        $question = Question::find($id);
        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        // Update the current question
        $question->update($request->all());

        return response()->json(
            ['message' => 'Question updated successfully'],
            200
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $question = Question::find($id);
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
