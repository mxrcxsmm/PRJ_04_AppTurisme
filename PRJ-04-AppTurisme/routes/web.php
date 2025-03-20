<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LugarController;
Route::get('/', function () {
    return view('welcome');
});
Route::get('/inicio', function () {
    return view('inicio');
});
Route::get('/api/lugares', [LugarController::class, 'index']);
