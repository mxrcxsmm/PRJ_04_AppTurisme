<?php
use App\Http\Controllers\LugarController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FavoritoController;

Route::get('/lugares', [LugarController::class, 'listJson'])->name('api.lugares');
// Definir la ruta para obtener todos los lugares
Route::get('/lugares', [LugarController::class, 'index']);

Route::post('/favoritos/toggle/{lugar}', [FavoritoController::class, 'toggle']);