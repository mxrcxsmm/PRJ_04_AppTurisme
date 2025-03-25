<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LugarController;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;


Route::get('/', function () {
    return redirect('/login');
});

Route::get('/inicio', function () {
    return view('inicio');
});
Route::get('/api/lugares', [LugarController::class, 'index']);


Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

Route::get('/register', [AuthController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [AuthController::class, 'register']);

// Ruta para cerrar sesión
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware(['auth'])->group(function () {
    Route::get('admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('inicio', [UserController::class, 'index'])->name('inicio');
    Route::get('/api/users', [UserController::class, 'getUsers']);
    Route::get('/api/grupos', [UserController::class, 'getGrupos']);
    Route::post('/api/grupos/join', [UserController::class, 'joinGrupo']);
});

