<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\UserGroup;
use Illuminate\Support\Facades\Session;

class LoginController extends Controller
{
    /**
     * Function to show login page
     */
    public function show()
    {
        return view('login');
    }

    /**
     * Seperate 'authenticated' route after user sends a submit form request
     * @param Request - the user's form request
     */
    public function authenticated(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return redirect('login')
                ->withErrors($validator)
                ->withInput()
                ->with(
                    'failed',
                    'validation has failed, please try again later'
                );
        }

        $existingUser = User::where('user_login', $request->username)->first();

        if ($existingUser) {
            // Use md5 encryption method to check for password
            if ($existingUser->user_password == md5($request->password)) {
                Auth::login($existingUser); // Globally declares that this Session has been logged in
                $user_group = UserGroup::where(
                    'user_group_id',
                    "=",
                    $existingUser->user_group_id
                )->first();
                Session::put("user_group", $user_group);
                return redirect('/home');
            } else {
                return redirect('login')
                    ->withErrors($validator)
                    ->withInput()
                    ->with('failed', 'incorrect password');
                // Creating a new error called 'failed' with message 'incorrect password'
            }
        } else {
            // If not an existing user
            return redirect('login')
                ->withErrors($validator)
                ->withInput()
                ->with('failed', 'user not found'); // Error will be viewed in frontend
        }
    }

    /**
     * A function to logout the current existing user
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('login');
    }
}
