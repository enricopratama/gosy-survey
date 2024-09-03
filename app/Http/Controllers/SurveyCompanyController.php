<?php

namespace App\Http\Controllers;

use App\Models\SurveyCompany;
use Illuminate\Http\Request;
use App\Models\Branch;

class SurveyCompanyController extends Controller
{
    /**
     * Display a listing of the survey companies.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Eager load the related Branch and Survey models
        $companies = SurveyCompany::with(['branch', 'survey'])->get();
        return response()->json($companies);
    }

    /**
     * Store a newly created survey company in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'survey_id' => 'required|exists:surveys,survey_id',
            'company_code' => 'required|string|max:255',
            'data_status' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $company = SurveyCompany::create($validatedData);

        // Eager load the related Branch and Survey models after creation
        $company->load(['branch', 'survey']);

        return response()->json($company, 201);
    }

    /**
     * Display the specified survey company.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $company = SurveyCompany::with(['branch', 'survey'])->find($id);

        if (!$company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        return response()->json($company);
    }

    /**
     * Update the `is_active` status of a survey company based on the company code.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $CompanyCode
     * @return \Illuminate\Http\Response
     */
    public function updateCompanyCodeActive(Request $request, $CompanyCode)
    {
        $validator = Validator::make($request->all(), [
            'BranchCode' => 'required|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'status' => 0,
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ],
                422
            );
        }

        // Find the survey company record by CompanyCode and BranchCode
        $surveyCompany = SurveyCompany::where(
            'BranchCode',
            $request->BranchCode
        )
            ->where('CompanyCode', $CompanyCode)
            ->first();

        if (!$surveyCompany) {
            return response()->json(
                ['message' => 'Survey company not found'],
                404
            );
        }

        DB::beginTransaction();
        try {
            // Update the is_active field only
            $surveyCompany->update(['is_active' => $request->is_active]);
            DB::commit();
            return response()->json(
                [
                    'status' => 1,
                    'message' => 'Survey company updated successfully',
                    'data' => $surveyCompany,
                ],
                200
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'status' => 0,
                    'message' => 'Failed to update survey company',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Remove the specified survey company from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $company = SurveyCompany::find($id);

        if (!$company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        $company->delete();

        return response()->json(['message' => 'Company deleted successfully']);
    }
}
