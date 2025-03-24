<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LugarController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return redirect('/login');
});

// Rutas públicas
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

Route::get('/register', [AuthController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [AuthController::class, 'register']);

Route::get('/inicio', function () {
    return view('inicio');
})->middleware('auth')->name('inicio');

// API para lugares
Route::get('/api/lugares', [LugarController::class, 'index']);
Route::get('/api/lugares/buscar', [LugarController::class, 'buscar']); 

// Ruta para cerrar sesión
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Rutas protegidas por autenticación
Route::middleware(['auth'])->group(function () {
    Route::get('admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('inicio', [UserController::class, 'index'])->name('inicio');
    Route::get('/api/users', [UserController::class, 'getUsers']);
});