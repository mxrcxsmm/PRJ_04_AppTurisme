<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LugarController;

// Definir la ruta para obtener todos los lugares
Route::get('/lugares', [LugarController::class, 'index']);
?>