<?php

namespace App\Http\Controllers;

use App\Models\SurveyCompany;
use Illuminate\Http\Request;
use App\Models\Branch;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

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
     * Update the `is_active` status of a survey company based on the CompanyCode column.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $CompanyCode
     * @return \Illuminate\Http\Response
     */
    public function updateCompanyCodeActive(Request $request, $CompanyCode)
    {
        // Validate the is_active field from the request
        $validator = Validator::make($request->all(), [
            'is_active' => 'required|boolean', // Assuming it's a boolean value
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

        DB::beginTransaction();
        try {
            // Find all survey company records by CompanyCode and update them
            $updatedRecords = SurveyCompany::where(
                'company_code',
                $CompanyCode
            )->update(['is_active' => $request->is_active]);

            // Check if any records were updated
            if ($updatedRecords) {
                DB::commit();
                return response()->json(
                    [
                        'status' => 1,
                        'message' => "Survey companies updated successfully",
                        'updated_records' => $updatedRecords, // Number of records updated
                    ],
                    200
                );
            } else {
                return response()->json(
                    ['message' => 'No survey company records found to update'],
                    404
                );
            }
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
     * Update the `is_active` status of all survey companies based on the CompanyCode column.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $CompanyCode
     * @return \Illuminate\Http\Response
     */
    // public function updateCompanyCodeActive(Request $request, $CompanyCode)
    // {
    //     // Validate the is_active field from the request
    //     $validator = Validator::make($request->all(), [
    //         'is_active' => 'required|boolean',
    //     ]);

    //     if ($validator->fails()) {
    //         $errors = $validator->errors();
    //         $messages = ['Oops.. validation error'];
    //         foreach ($errors->all() as $error) {
    //             $messages[] = $error;
    //         }
    //         return response()->json(
    //             [
    //                 'status' => 0,
    //                 'message' => implode(' | ', $messages),
    //                 'data' => $errors,
    //             ],
    //             422
    //         );
    //     }

    //     // Find all survey company records by CompanyCode
    //     $surveyCompanies = SurveyCompany::where(
    //         'company_code',
    //         $CompanyCode
    //     )->get();

    //     if ($surveyCompanies->isEmpty()) {
    //         return response()->json(
    //             [
    //                 'message' =>
    //                     'No survey companies found for the provided company code',
    //             ],
    //             404
    //         );
    //     }

    //     // Update the is_active field for all found records
    //     foreach ($surveyCompanies as $surveyCompany) {
    //         $surveyCompany->update(['is_active' => $request->is_active]);
    //     }

    //     return response()->json(
    //         [
    //             'status' => 1,
    //             'message' => "Survey companies updated successfully",
    //             'updated_records' => $surveyCompanies->count(), // Number of records updated
    //         ],
    //         200
    //     );
    // }

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
