<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Grupo;
use App\Models\PuntoControl;

class UserController extends Controller
{
    public function index()
    {
        $user = auth()->user();
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
}
