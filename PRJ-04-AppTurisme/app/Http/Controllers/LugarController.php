<?php

namespace App\Http\Controllers;

use App\Models\Lugar;
use Illuminate\Http\Request;

class LugarController extends Controller
{
    public function index()
    {
        return Lugar::with('etiquetas')->get();

        return response()->json($lugares);
    }

   public function buscar(Request $request)
   {
       $query = $request->input('q'); // Obtener el término de búsqueda

       if (empty($query)) {
           return response()->json([]); // Devolver una lista vacía si no hay término
       }

       // Buscar lugares cuyo nombre o descripción coincidan con el término
       $lugares = Lugar::where('nombre', 'LIKE', "%{$query}%")
                       ->orWhere('descripcion', 'LIKE', "%{$query}%")
                       ->get();

       return response()->json($lugares);
   }
}