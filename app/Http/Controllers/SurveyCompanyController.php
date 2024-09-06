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
    // public function updateCompanyCodeActive(Request $request, $CompanyCode)
    // {
    //     // Validate the is_active field from the request
    //     $validator = Validator::make($request->all(), [
    //         'is_active' => 'required|boolean', // Assuming it's a boolean value
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json(
    //             [
    //                 'status' => 0,
    //                 'message' => 'Validation error',
    //                 'errors' => $validator->errors(),
    //             ],
    //             422
    //         );
    //     }

    //     DB::beginTransaction();
    //     try {
    //         $updatedRecords = SurveyCompany::where(
    //             'company_code',
    //             $CompanyCode
    //         )->update(['is_active' => $request->is_active]);

    //         // Check if any records were updated
    //         if ($updatedRecords) {
    //             DB::commit();
    //             return response()->json(
    //                 [
    //                     'status' => 1,
    //                     'message' => "Survey companies updated successfully",
    //                     'updated_records' => $updatedRecords,
    //                 ],
    //                 200
    //             );
    //         } else {
    //             return response()->json(
    //                 ['message' => 'No survey company records found to update'],
    //                 404
    //             );
    //         }
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return response()->json(
    //             [
    //                 'status' => 0,
    //                 'message' => 'Failed to update survey company',
    //                 'error' => $e->getMessage(),
    //             ],
    //             500
    //         );
    //     }
    // }

    /**
     * Update the `is_active` status of a survey company based on the CompanyCode column.
     * start_date and end_date is optional for now
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $CompanyCode
     * @return \Illuminate\Http\Response
     */
    public function updateCompanyCodeActive(Request $request, $CompanyCode)
    {
        $validator = Validator::make($request->all(), [
            'is_active' => 'required|boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
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
            $updateData = [
                'is_active' => $request->is_active,
            ];

            // Optional Fields: Parse the date format if provided
            if ($request->has('start_date')) {
                $updateData['start_date'] = date(
                    'Y-m-d',
                    strtotime($request->start_date)
                );
            }
            if ($request->has('end_date')) {
                $updateData['end_date'] = date(
                    'Y-m-d',
                    strtotime($request->end_date)
                );
            }

            // Update the survey companies matching the company_code
            $updatedRecords = SurveyCompany::where(
                'company_code',
                $CompanyCode
            )->update($updateData);

            // Check if any records were updated
            if ($updatedRecords) {
                DB::commit();
                return response()->json(
                    [
                        'status' => 1,
                        'message' => "Survey companies updated successfully",
                        'updated_records' => $updatedRecords,
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
