<?php

namespace App\Http\Controllers;

use App\Models\Gimcana;
use App\Models\PuntoControl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GimcanaController extends Controller
{
    // Listado de gimcanas (vista de administración)
    public function index()
    {
        $gimcanas = Gimcana::orderBy('id', 'desc')->get();
        return view('admin.gimcanas.index', compact('gimcanas'));
    }

    // Formulario para crear una nueva gimcana
    public function create()
    {
        // Carga los puntos de control junto con su relación "lugar"
        $puntos = PuntoControl::with('lugar')->get();
        return view('admin.gimcanas.create', compact('puntos'));
    }

    // Guardar nueva gimcana (con transacción)
    public function store(Request $request)
    {
        $request->validate([
            'nombre'         => 'required|string|max:255',
            'descripcion'    => 'required|string',
            // Se requiere un array con al menos 4 puntos de control
            'puntos_control' => 'required|array|min:4',
            'puntos_control.*' => 'exists:puntos_control,id',
        ]);

        try {
            DB::beginTransaction();

            // Crear la gimcana
            $gimcana = Gimcana::create([
                'nombre'      => $request->nombre,
                'descripcion' => $request->descripcion,
            ]);

            // Sincronizar la relación muchos a muchos con los puntos de control
            $gimcana->puntosControl()->sync($request->puntos_control);

            DB::commit();

            return redirect()->route('admin.gimcanas.index')
                ->with('success', 'Gimcana creada correctamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.gimcanas.index')
                ->with('error', 'Ocurrió un error al crear la gimcana.');
        }
    }

    // Formulario para editar una gimcana
    public function edit(Gimcana $gimcana)
    {
        // Carga todos los puntos de control con su relación "lugar"
        $puntos = PuntoControl::with('lugar')->get();
        $puntosSeleccionados = $gimcana->puntosControl->pluck('id')->toArray();
        return view('admin.gimcanas.edit', compact('gimcana', 'puntos', 'puntosSeleccionados'));
    }

    // Actualizar gimcana (con transacción)
    public function update(Request $request, Gimcana $gimcana)
    {
        $request->validate([
            'nombre'         => 'required|string|max:255',
            'descripcion'    => 'required|string',
            'puntos_control' => 'required|array|min:4',
            'puntos_control.*' => 'exists:puntos_control,id',
        ]);

        try {
            DB::beginTransaction();

            // Actualizar la gimcana
            $gimcana->update([
                'nombre'      => $request->nombre,
                'descripcion' => $request->descripcion,
            ]);

            // Sincronizar los puntos de control seleccionados
            $gimcana->puntosControl()->sync($request->puntos_control);

            DB::commit();

            return redirect()->route('admin.gimcanas.index')
                ->with('success', 'Gimcana actualizada correctamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.gimcanas.index')
                ->with('error', 'Ocurrió un error al actualizar la gimcana.');
        }
    }

    // Eliminar gimcana
    public function destroy(Gimcana $gimcana)
    {
        // Se elimina el registro y, si la relación en la tabla pivote está configurada con onDelete cascade, se eliminarán automáticamente los registros relacionados.
        $gimcana->delete();
        return redirect()->route('admin.gimcanas.index')
            ->with('success', 'Gimcana eliminada correctamente.');
    }

    /**
     * Devuelve una lista de todas las gimcanas en formato JSON.
     */
    public function listJson()
    {
        try {
            $gimcanas = Gimcana::orderBy('id', 'desc')->with('puntosControl')->get();
            return response()->json($gimcanas, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener las gimcanas'], 500);
        }
    }
}
