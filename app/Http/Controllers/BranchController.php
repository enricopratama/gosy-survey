<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Branch;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

// gpd_mst_branch controller
class BranchController extends Controller
{
    /**
     * Display a listing of the branches.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $branches = Branch::all();
        return response()->json($branches);
    }

    /**
     * Get a specific branch by its BranchCode.
     *
     * @param  string  $BranchCode
     * @return \Illuminate\Http\Response
     */
    public function getByBranchCode($BranchCode)
    {
        $branch = Branch::where('BranchCode', $BranchCode)->first();
        if (!empty($branch)) {
            return response()->json($branch);
        } else {
            return response()->json(
                [
                    'message' => 'Branch not found',
                ],
                404
            );
        }
    }

    /**
     * Retrieves a list of branches with associated survey details from the database.
     *
     * This method joins the `gpd_mst_branch` table with the `mst_survey_company` table
     * to fetch details about each branch, including its survey activity status (`is_active`).
     * The results are distinct and are ordered by `BranchCode` to ensure consistency.
     *
     * @return \Illuminate\Http\JsonResponse
     *     A JSON response containing an array of branches with the following details:
     *     - BranchCode: The unique code of the branch, cast as an integer.
     *     - CompanyCode: The code representing the company to which the branch belongs.
     *     - Wilayah: The regional designation of the branch.
     *     - RSO: The regional sales office (RSO) associated with the branch.
     *     - Area: The area in which the branch is located.
     *     - CompanyName: The name of the company, assuming it's available in the branch table.
     *     - BranchName: The name of the branch.
     *     - is_active: A boolean value indicating whether the branch is active in the survey.
     */
    public function getBranchesWithSurveyDetails()
    {
        $branches = DB::table('gpd_mst_branch as gmb')
            ->join(
                'mst_survey_company as msc',
                'msc.company_code',
                '=',
                'gmb.CompanyCode'
            )
            ->select(
                'gmb.BranchCode',
                'gmb.CompanyCode',
                'gmb.Wilayah',
                'gmb.RSO',
                'gmb.Area',
                'gmb.CompanyName', // Assuming CompanyName is available in the gpd_mst_branch table
                'gmb.BranchName',
                'msc.is_active' // Include is_active field from mst_survey_company table
            )
            ->orderBy('gmb.BranchCode')
            ->distinct()
            ->get()
            ->map(function ($item) {
                return [
                    'BranchCode' => $item->BranchCode,
                    'CompanyCode' => $item->CompanyCode,
                    'Wilayah' => $item->Wilayah,
                    'RSO' => $item->RSO,
                    'Area' => $item->Area,
                    'CompanyName' => $item->CompanyName,
                    'BranchName' => $item->BranchName,
                    'is_active' => $item->is_active,
                ];
            });

        return response()->json($branches);
    }

    // public function getBranchesWithSurveyDetails()
    // {
    //     $branches = DB::table('gpd_mst_branch as gmb')
    //         ->join(
    //             'mst_survey_company as msc',
    //             'msc.company_code',
    //             '=',
    //             'gmb.CompanyCode'
    //         )
    //         ->select(
    //             'gmb.BranchCode',
    //             'gmb.CompanyCode',
    //             'gmb.Wilayah',
    //             'gmb.RSO',
    //             'gmb.Area',
    //             'gmb.BranchName',
    //             'msc.start_date',
    //             'msc.end_date',
    //             'msc.is_active'
    //         )
    //         ->distinct()
    //         ->get();

    //     return response()->json($branches);
    // }

    /**
     * Store a newly created branch in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'BranchCode' => 'required|string|max:255|unique:gpd_mst_branch',
            'CompanyCode' => 'required|string|max:255',
            'RSO' => 'nullable|string|max:255',
            'Area' => 'nullable|string|max:255',
            'DSOAll' => 'nullable|string|max:255',
            'CompanyName' => 'required|string|max:255',
            'BranchName' => 'required|string|max:255',
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
            $branch = Branch::create($request->all());
            DB::commit();
            return response()->json(
                [
                    'status' => 1,
                    'message' => "Successfully Saved Branch",
                    'data' => $branch,
                ],
                200
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'status' => 0,
                    'message' => 'Failed to Save Branch',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Update the specified branch in storage per Company Code. 
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $BranchCode
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $BranchCode)
    {
        $validator = Validator::make($request->all(), [
            'CompanyCode' => 'required|string|max:255',
            'RSO' => 'nullable|string|max:255',
            'Area' => 'nullable|string|max:255',
            'DSOAll' => 'nullable|string|max:255',
            'CompanyName' => 'required|string|max:255',
            'BranchName' => 'required|string|max:255',
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

        // Find the branch by BranchCode and CompanyCode
        $branch = Branch::where('BranchCode', $BranchCode)
            ->where('CompanyCode', $request->CompanyCode)
            ->first();

        if (!$branch) {
            return response()->json(['message' => 'Branch not found'], 404);
        }

        DB::beginTransaction();
        try {
            $branch->update($request->all());
            DB::commit();
            return response()->json(
                [
                    'status' => 1,
                    'message' => 'Branch updated successfully',
                    'data' => $branch,
                ],
                200
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'status' => 0,
                    'message' => 'Failed to update Branch',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Remove the specified branch from storage.
     *
     * @param  string  $BranchCode
     * @return \Illuminate\Http\Response
     */
    public function destroy($BranchCode)
    {
        $branch = Branch::where('BranchCode', $BranchCode)->first();
        if (!$branch) {
            return response()->json(['message' => 'Branch not found'], 404);
        }

        $branch->delete();

        return response()->json(
            ['message' => 'Branch deleted successfully'],
            200
        );
    }
}
