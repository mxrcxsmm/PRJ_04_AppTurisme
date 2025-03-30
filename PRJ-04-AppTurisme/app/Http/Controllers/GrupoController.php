<?php

namespace App\Http\Controllers;

use App\Models\Grupo;
use App\Models\Usuario;
use Illuminate\Http\Request;

class GrupoController extends Controller
{
    // Crear un grupo
    public function createGroup(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'gimcana_id' => 'nullable|exists:gimcanas,id',
        ]);

        $codigo = strtoupper(substr(md5(uniqid()), 0, 6)); // Generar un código único de 6 caracteres

        $grupo = Grupo::create([
            'nombre' => $request->input('nombre'),
            'descripcion' => $request->input('descripcion'),
            'codigo' => $codigo,
            'gimcana_id' => $request->input('gimcana_id'),
        ]);

        return response()->json([
            'mensaje' => 'Grupo creado correctamente.',
            'codigo' => $grupo->codigo,
        ], 201);
    }

    // Unirse a un grupo
    public function joinGroup(Request $request)
    {
        $request->validate([
            'codigo' => 'required|string|size:6',
            'usuario_id' => 'required|exists:usuarios,id',
        ]);

        $grupo = Grupo::where('codigo', $request->input('codigo'))->first();

        if (!$grupo) {
            return response()->json(['error' => 'El código del grupo no es válido.'], 404);
        }

        $usuario = Usuario::find($request->input('usuario_id'));
        $usuario->grupo_id = $grupo->id;
        $usuario->save();

        return response()->json([
            'mensaje' => 'Te has unido al grupo correctamente.',
            'grupo' => $grupo->nombre,
        ]);
    }
}
