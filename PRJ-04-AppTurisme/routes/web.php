<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LugarController;
use App\Http\Controllers\EtiquetaController;
use App\Http\Controllers\PuntoControlController;
use App\Http\Controllers\FavoritoController;
use App\Http\Controllers\GimcanaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GrupoController;
use Illuminate\Support\Facades\Auth;



Route::get('/', function () {
    return redirect('/login');
});

Route::get('/inicio', function () {
    return view('inicio');
})->middleware('auth')->name('inicio');

Route::get('/api/authenticated-user', function () {
    return response()->json(['name' => Auth::user()->nombre]);
});

Route::middleware(['auth'])->group(function () {
    // Main view
    Route::get('inicio', [UserController::class, 'index'])->name('inicio');
    
    // User and group management
    Route::get('/api/users', [UserController::class, 'getUsers']);
    Route::post('/groups/create', [GrupoController::class, 'createGroup'])->name('groups.create');
    Route::post('/groups/join', [GrupoController::class, 'joinGroup'])->name('groups.join');
    Route::get('/api/grupos/{grupo}/members', [GrupoController::class, 'getMembers']);
    
    // Favorites routes
    Route::get('/user/favoritos', [FavoritoController::class, 'index']);
    Route::post('/lugares/{lugar}/favorito', [FavoritoController::class, 'toggle']);
    
    // Group routes
    Route::post('/groups/create', [GrupoController::class, 'createGroup'])->name('groups.create');
    Route::post('/groups/join', [GrupoController::class, 'joinGroup'])->name('groups.join');
});

// Admin routes
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function() {
    // CRUD resources
    Route::resource('lugares', LugarController::class);
    Route::resource('etiquetas', EtiquetaController::class);
    Route::resource('puntos-control', PuntoControlController::class);
    Route::resource('gimcanas', GimcanaController::class);
});

// Public/API routes
Route::get('/map', [LugarController::class, 'map'])->name('map');
Route::get('/lugares/json', [LugarController::class, 'json'])->name('lugares.json');
Route::get('/api/lugares', [LugarController::class, 'apiIndex']);
Route::get('/api/lugares/buscar', [LugarController::class, 'buscar']);

// Authentication routes
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/register', [AuthController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [AuthController::class, 'register']);

// API para lugares
Route::get('/admin/lugares', [LugarController::class, 'index'])->name('admin.lugares.index');

// Ruta para la API (devuelve JSON)
Route::get('/api/lugares', [LugarController::class, 'apiIndex']);
Route::get('/api/lugares/buscar', [LugarController::class, 'buscar']);

Route::get('/api/gimcanas', [GimcanaController::class, 'listJson'])->name('api.gimcanas');
Route::get('/api/authenticated-user', function () {
    return response()->json(['name' => Auth::user()->nombre]);
});