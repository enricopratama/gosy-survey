<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class SurveyController extends Controller
{
    public function index()
    {
        $surveys = Survey::all();
        return response()->json($surveys);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'question_group_id' => 'required|integer',
            'question_group_name' => 'required|string|max:1000',
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
                500
            );
        }

        DB::beginTransaction();
        try {
            $new = Survey::create([
                'question_group_id' => $request->question_group_id,
                'question_group_name' => $request->question_group_name,
                'data_status' => $request->data_status
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
}
