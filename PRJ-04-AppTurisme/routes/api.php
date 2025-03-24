<?php
use App\Http\Controllers\LugarController;
use Illuminate\Support\Facades\Route;

Route::get('/lugares', [LugarController::class, 'listJson'])->name('api.lugares');