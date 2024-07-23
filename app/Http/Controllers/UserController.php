<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    /**
     * Get User Properties for columns of database for Master User Access
     */
    public function getUserAccess()
    {
        $users = User::selectRaw(
            "mst_user.user_id, mst_user.user_login, mst_user.salesman_code, mst_user.account_name, group_concat(b.company_code) as company_code"
        )
            ->leftJoin(
                'mst_user_company as b',
                'mst_user.user_id',
                '=',
                'b.user_id'
            )
            ->groupBy(
                "mst_user.user_id",
                "mst_user.user_login",
                "mst_user.salesman_code",
                "mst_user.account_name"
            )
            ->get();

        // $users= User::select("mst_user.user_id","b.")
        // ->leftJoin('mst_usr_company as b','mst_user.user_id','=','b.user_id')
        // ->leftJoin('mst_usr_company as b',function($j){
        //     $j->on('mst_user.user_id','=','b.user_id')->where('b.status','=','1');
        // })
        // ->get();
        return response()->json($users);
    }

    public function getAccessToken()
    {
        $users = User::select(
            'mst_user.user_id',
            'mst_user_company.*',
            'mst_otp_user_ac.*'
        )
            ->leftJoin(
                'mst_user_company',
                'mst_user.user_id',
                '=',
                'mst_user_company.user_id'
            )
            ->leftJoin(
                'mst_otp_user_ac',
                'mst_user.user_id',
                '=',
                'mst_otp_user_ac.user_id'
            )
            ->get();

        return response()->json($users);
    }

    /**
     * Get User Properties for columns of database for Master User Access
     */
    public function getUserAccessByCompany()
    {
        $users = User::select(
            "mst_user.user_id",
            "mst_user.user_login",
            "mst_user.salesman_code",
            "mst_user.account_name",
            "b.company_code"
        )
            ->leftJoin(
                'mst_user_company as b',
                'mst_user.user_id',
                '=',
                'b.user_id'
            )
            ->get();

        return response()->json($users);
    }

    public function show($user_id)
    {
        $user = User::find($user_id);
        if (!empty($user)) {
            return response()->json($user);
        } else {
            return response()->json(
                [
                    'message' => 'user not found',
                ],
                404
            );
        }
    }

    public function update(Request $req, $user_id)
    {
        if (User::where('user_id', $user_id)->exists()) {
            $user = User::find($user_id);
            // add more controller logic here, depending on mst_user columns
        } else {
            return response()->json(
                [
                    "message" => "User not found",
                ],
                404
            );
        }
    }

    /**
     * Register or login a user
     *
     * @param  \Illuminate\Http\Request  $req
     * @return \Illuminate\Http\Response
     */
    public function register(Request $req)
    {
        // Validate the request data
        $validatedData = $req->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
        ]);

        // Check if user already exists
        $existingUser = User::where('email', $req->input('email'))->first();

        if ($existingUser) {
            // Attempt to login
            if (
                Auth::attempt([
                    'email' => $req->input('email'),
                    'password' => $req->input('password'),
                ])
            ) {
                // Authentication passed, return user data
                return response()->json(
                    [
                        'message' => 'Logged in successfully',
                        'user' => Auth::user(),
                    ],
                    200
                );
            } else {
                // Authentication failed
                return response()->json(
                    ['message' => 'Invalid credentials, login failed'],
                    401
                );
            }
        } else {
            // Register new user
            $user = new User();
            $user->name = $req->input('name');
            $user->email = $req->input('email');
            $user->password = Hash::make($req->input('password'));
            $user->save(); // To save it back into the User in Models, where Models will communicate w/ DB

            // Automatically log in the user after registration
            Auth::login($user);

            return response()->json(
                [
                    'message' => 'User registered and logged in successfully',
                    'user' => $user,
                ],
                201
            );
        }
    }
}
