<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('admin_new_booking');
});

Route::get('/token', function () {

  return  response()->json(['csrfToken' => csrf_token()]);    
});


require __DIR__.'/auth.php';
