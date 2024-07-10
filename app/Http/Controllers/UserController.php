<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\MstUser;

class UserController extends Controller
{
    /**
     * For MstUser table, not User (testing)
     */
    public function show()
    {
        $users = MstUser::all();
        return response()->json($users);
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

    /**
     * Login user
     *
     * @param  \Illuminate\Http\Request  $req
     * @return \Illuminate\Http\Response
     */
    public function login(Request $req)
    {
        $user = User::where('email', $req->email)->first();
        // $credentials = $req->validate([
        //     'email' => 'required|string|email',
        //     'password' => 'required|string',
        // ]);

        // if (Auth::attempt($credentials)) {
        //     // Authentication passed
        //     return response()->json(
        //         ['message' => 'Logged in successfully', 'user' => Auth::user()],
        //         200
        //     );
        // } else {
        //     // Authentication failed
        //     return response()->json(
        //         ['message' => 'Invalid credentials, login failed'],
        //         401
        //     );
        // }
        return $user;
    }
}