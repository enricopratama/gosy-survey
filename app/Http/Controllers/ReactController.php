<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReactController extends Controller
{
    /**
     * Show the React app view.
     *
     * @return \Illuminate\View\View
     */
    public function show()
    {
        return view('app');
    }
}
