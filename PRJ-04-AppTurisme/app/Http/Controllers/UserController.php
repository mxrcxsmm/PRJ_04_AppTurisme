<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Grupo;
use App\Models\PuntoControl;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $grupo = $user->grupo;
        $usuarios = User::where('grupo_id', null)->get();
        $puntoControl = null;

        if ($grupo) {
            // Si está en un grupo, obtener el siguiente punto de control
            $puntoControl = PuntoControl::where('grupo_id', $grupo->id)
                ->orderBy('orden', 'asc')
                ->first();
        }

        return view('inicio', compact('user', 'grupo', 'usuarios', 'puntoControl'));
    }

    public function getUsers()
    {
        return User::where('grupo_id', null)->get();
    }
    public function getGrupos()
{
    return Grupo::with('usuarios')
        ->whereDoesntHave('usuarios', function($query) {
            $query->where('id', auth()->id());
        })
        ->has('usuarios', '<', 4)
        ->get();
}

public function joinGrupo(Request $request)
{
    $grupo = Grupo::findOrFail($request->grupo_id);
    
    if ($grupo->usuarios()->count() >= 4) {
        return response()->json(['error' => 'Grupo lleno'], 400);
    }

    $user = auth()->user();
    $user->grupo_id = $grupo->id;
    $user->save();

    return response()->json(['success' => true]);
}
}
