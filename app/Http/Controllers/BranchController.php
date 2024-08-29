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
     * Update the specified branch in storage.
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

        $branch = Branch::where('BranchCode', $BranchCode)->first();
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
