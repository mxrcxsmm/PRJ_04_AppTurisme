<?php

namespace App\Http\Controllers;

use App\Models\Grupo;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class GrupoController extends Controller
{
    public function createGroup(Request $request)
    {
        $request->validate([
            'gimcana_id' => 'required|exists:gimcanas,id'
        ]);

        $codigo = Str::upper(Str::random(6));

        $grupo = Grupo::create([
            'nombre' => 'Grupo ' . $codigo,
            'descripcion' => 'Grupo creado automáticamente',
            'codigo' => $codigo,
            'gimcana_id' => $request->gimcana_id
        ]);

        // Asociar el usuario actual al grupo
        Auth::user()->update(['grupo_id' => $grupo->id]);

        return response()->json([
            'success' => true,
            'codigo' => $codigo,
            'grupo' => $grupo
        ]);
    }

    public function joinGroup(Request $request)
    {
        $request->validate([
            'codigo' => 'required|string|size:6|exists:grupos,codigo'
        ]);

        $grupo = Grupo::where('codigo', $request->codigo)->first();

        if ($grupo->usuarios()->count() >= 4) {
            return response()->json([
                'success' => false,
                'message' => 'El grupo ya está lleno (máximo 4 personas)'
            ], 400);
        }

        if (Auth::user()->grupo_id) {
            return response()->json([
                'success' => false,
                'message' => 'Ya estás en un grupo'
            ], 400);
        }

        Auth::user()->update(['grupo_id' => $grupo->id]);

        return response()->json([
            'success' => true,
            'grupo' => $grupo
        ]);
    }

    public function getMembers(Grupo $grupo)
    {
        $members = $grupo->usuarios()->pluck('nombre')->toArray();
        
        return response()->json([
            'success' => true,
            'members' => $members
        ]);
    }
}
