<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class LoginController extends Controller
{
    /**
     * Function to show login page
     */
    public function show()
    {
        return view('login');
    }

    public function authenticated(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return redirect('login')
                ->withErrors($validator)
                ->withInput();
        }
        $existingUser = User::where('user_login', $request->username)->first();

        if ($existingUser) {
            // Use md5 encryption method to check for password
            if ($existingUser->user_password == md5($request->password)) {
                Auth::login($existingUser); // Globally declares that this Session has been logged in
                return redirect('/home');
            } else {
                return redirect('login')
                    ->withErrors($validator)
                    ->withInput()
                    ->with('failed', 'incorrect password');
                // creating a new error called 'failed' with message 'incorrect password'
            }
        } else {
            // If not an existing user
            return redirect('login')
                ->withErrors($validator)
                ->withInput()
                ->with('failed', 'user not found');
        }
    }

    /**
     * A function to logout the current existing user
     */
    function logout()
    {
        Auth::logout();
        return redirect('login');
    }
}
