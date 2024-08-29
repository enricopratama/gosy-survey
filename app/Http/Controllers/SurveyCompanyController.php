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
     * Update the specified survey company in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $company = SurveyCompany::find($id);

        if (!$company) {
            return response()->json(['message' => 'Company not found'], 404);
        }

        $validatedData = $request->validate([
            'survey_id' => 'sometimes|required|exists:surveys,survey_id',
            'company_code' => 'sometimes|required|string|max:255',
            'data_status' => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $company->update($validatedData);

        // Eager load the related Branch and Survey models after update
        $company->load(['branch', 'survey']);

        return response()->json($company);
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
