<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
  //return a message 
  return 'Something went wrong!';
});

Route::get('/token', function () {

  return  response()->json(['csrfToken' => csrf_token()]);    
});


require __DIR__.'/auth.php';
