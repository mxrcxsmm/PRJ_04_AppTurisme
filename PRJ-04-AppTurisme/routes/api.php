<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LugarController;
use App\Http\Controllers\GimcanaController;

// Ruta para obtener todos los lugares en formato JSON
Route::get('/lugares', [LugarController::class, 'listJson'])->name('api.lugares');

// Ruta para obtener todas las gimcanas en formato JSON
Route::get('/gimcanas', [GimcanaController::class, 'listJson'])->name('api.gimcanas');
