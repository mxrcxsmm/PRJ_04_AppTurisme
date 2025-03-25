<?php
use App\Http\Controllers\LugarController;
use App\Http\Controllers\GimcanaController; // Importar el controlador de gimcanas
use Illuminate\Support\Facades\Route;

// Ruta para obtener todos los lugares
Route::get('/lugares', [LugarController::class, 'listJson'])->name('api.lugares');

// Ruta para obtener todas las gimcanas en formato JSON
Route::get('/gimcanas', [GimcanaController::class, 'listJson'])->name('api.gimcanas');