<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LugarController;
use App\Http\Controllers\GimcanaController;
use App\Http\Controllers\FavoritoController;
use App\Http\Controllers\GrupoController;

// Ruta para obtener todos los lugares en formato JSON
Route::get('/lugares', [LugarController::class, 'listJson'])->name('api.lugares');

// Ruta para obtener todas las gimcanas en formato JSON
Route::get('/gimcanas', [GimcanaController::class, 'listJson'])->name('api.gimcanas');
// Definir la ruta para obtener todos los lugares
Route::get('/lugares', [LugarController::class, 'index']);

Route::post('/favoritos/toggle/{lugar}', [FavoritoController::class, 'toggle']);

// Rutas para grupos (API)
Route::post('/groups/create', [GrupoController::class, 'createGroup']);
Route::post('/groups/join', [GrupoController::class, 'joinGroup']);