<?php

namespace App\Http\Controllers;

use App\Models\Favorito;
use App\Models\Lugar;
use Illuminate\Http\Request;

class FavoritoController extends Controller
{
    /**
     * Obtiene los favoritos del usuario actual
     */
    public function index(Request $request)
    {
        $favoritos = $request->user()->favoritos()->get(['lugar_id']);
        return response()->json($favoritos);
    }

    /**
     * Marca o desmarca un lugar como favorito para el usuario actual.
     */
    public function toggle(Request $request, Lugar $lugar)
{
    $user = $request->user();
    $favorito = $user->favoritos()->where('lugar_id', $lugar->id)->first();

    if ($favorito) {
        $favorito->delete();
        return response()->json([
            'status' => 'removed',
            'message' => 'Lugar quitado de favoritos',
            'lugar_id' => $lugar->id
        ]);
    }

    $user->favoritos()->create([
        'lugar_id' => $lugar->id,
        'nombre_etiqueta' => $lugar->etiquetas->first()->nombre ?? 'General'
    ]);

    return response()->json([
        'status' => 'added',
        'message' => 'Lugar añadido a favoritos',
        'lugar_id' => $lugar->id
    ]);
}
}