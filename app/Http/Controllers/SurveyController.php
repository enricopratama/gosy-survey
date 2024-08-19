<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Survey;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SurveyController extends Controller
{
    public function index()
    {
        $surveys = Survey::all();
        return response()->json($surveys);
    }

    public function getBySurveyName($survey_name)
    {
        $survey = Survey::where('survey_name', $survey_name)->first();
        if (!empty($survey)) {
            return response()->json($survey);
        } else {
            return response()->json(
                [
                    'message' => 'Survey not found',
                ],
                404
            );
        }
    }

    /**
     * Store the survey in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'survey_name' =>
                'required|string|max:50|unique:mst_survey,survey_name',
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
                'survey_name' => $request->survey_name,
                'data_status' => $request->data_status,
            ]);
            DB::commit();
            return response()->json(
                [
                    'status' => 1,
                    'message' => "Successfully Saved Survey",
                    'data' => $new,
                ],
                200
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'status' => 0,
                    'message' => 'Failed to Save Survey',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Update the survey in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $survey_id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $survey_id)
    {
        $validator = Validator::make($request->all(), [
            'survey_name' =>
                'required|string|max:50|unique:surveys,survey_name,' .
                $survey_id,
            'data_status' => 'required|integer',
            'updated_by' => 'required|integer',
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

        $survey = Survey::find($survey_id);
        if (!$survey) {
            return response()->json(['message' => 'Survey not found'], 404);
        }

        $survey->update($request->all());

        return response()->json(
            ['message' => 'Survey updated successfully', 'data' => $survey],
            200
        );
    }

    /**
     * Remove the survey from storage.
     *
     * @param  int  $survey_id
     * @return \Illuminate\Http\Response
     */
    public function destroy($survey_id)
    {
        $survey = Survey::find($survey_id);
        if (!$survey) {
            return response()->json(['message' => 'Survey not found'], 404);
        }

        $survey->delete();

        return response()->json(
            ['message' => 'Survey deleted successfully'],
            200
        );
    }
}
