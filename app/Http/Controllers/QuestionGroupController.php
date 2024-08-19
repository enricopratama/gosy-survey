<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QuestionGroup;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class QuestionGroupController extends Controller
{
    public function index()
    {
        $questionGroups = QuestionGroup::all();
        return response()->json($questionGroups);
    }

    public function getByQuestionGroup($question_group_name)
    {
        $question = QuestionGroup::where(
            'question_group_name',
            $question_group_name
        )->first();
        if (!empty($question)) {
            return response()->json($question);
        } else {
            return response()->json(
                [
                    'message' => 'Question Group not found',
                ],
                404
            );
        }
    }

    /**
     * Store the questionGroup in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'question_group_name' =>
                'required|string|max:1000|unique:mst_question_group,question_group_name',
            'data_status' => 'required|integer',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            $messages = ['Oops.. validation error.'];
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
            $new = QuestionGroup::create([
                'question_group_name' => $request->question_group_name,
                'data_status' => $request->data_status,
            ]);
            DB::commit();
            return response()->json(
                [
                    'status' => 1,
                    'message' => "Successfully Saved Question Group",
                    'data' => $new,
                ],
                200
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'status' => 0,
                    'message' => 'Failed to Save Question Group',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Update the questionGroup in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $question_group_id)
    {
        $validator = Validator::make($request->all(), [
            'question_group_name' => 'required|string|max:1000',
            'data_status' => 'required|integer',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            $messages = ['Oops.. validation error.'];
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

        $questionGroup = QuestionGroup::find($question_group_id);
        if (!$questionGroup) {
            return response()->json(
                ['message' => 'Question Group not found'],
                404
            );
        }

        DB::beginTransaction();
        try {
            // Update the questionGroup with new data
            $questionGroup->update([
                'question_group_name' => $request->question_group_name,
                'data_status' => $request->data_status,
            ]);

            DB::commit();
            return response()->json(
                [
                    'status' => 1,
                    'message' => 'Question Group updated successfully',
                    'data' => $questionGroup,
                ],
                200
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'status' => 0,
                    'message' => 'Failed to update Question Group',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Remove the questionGroup from storage.
     *
     * @param  int  $question_group_id
     * @return \Illuminate\Http\Response
     */
    public function destroy($question_group_id)
    {
        $questionGroup = QuestionGroup::find($question_group_id);
        if (!$questionGroup) {
            return response()->json(
                ['message' => 'Question Group not found'],
                404
            );
        }

        $questionGroup->delete();

        return response()->json(
            ['message' => 'Question Group deleted successfully'],
            200
        );
    }
}
