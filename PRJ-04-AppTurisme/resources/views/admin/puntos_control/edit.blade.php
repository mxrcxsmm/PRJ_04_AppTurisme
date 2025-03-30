@extends('layouts.app')

@section('content')
<h1>Editar Punto de Control</h1>

@if($errors->any())
    <div class="alert alert-danger" style="display: none;" id="serverErrors">
        <ul>
          @foreach($errors->all() as $error)
             <li>{{ $error }}</li>
          @endforeach
        </ul>
    </div>
@endif

<form action="{{ route('admin.puntos-control.update', $puntos_control->id) }}" method="POST">
    @csrf
    @method('PUT')
    <div class="form-group">
        <label for="lugar_id">Lugar:</label>
        <select name="lugar_id" class="form-control" required>
            <option value="">-- Selecciona un lugar --</option>
            @foreach($lugares as $lugar)
                <option value="{{ $lugar->id }}" {{ $lugar->id == $puntos_control->lugar_id ? 'selected' : '' }}>
                    {{ $lugar->nombre }}
                </option>
            @endforeach
        </select>
    </div>
    <div class="form-group">
        <label for="descripcion">Descripción:</label>
        <textarea name="descripcion" class="form-control" rows="2" required>{{ old('descripcion', $puntos_control->descripcion) }}</textarea>
    </div>
    <div class="form-group">
        <label for="pista">Pista:</label>
        <textarea name="pista" class="form-control" rows="2" required>{{ old('pista', $puntos_control->pista) }}</textarea>
    </div>
    <div class="form-group">
        <label for="prueba">Prueba:</label>
        <textarea name="prueba" class="form-control" rows="2" required>{{ old('prueba', $puntos_control->prueba) }}</textarea>
    </div>
    <div class="form-group">
        <label for="respuesta_correcta">Respuesta Correcta:</label>
        <input type="text" name="respuesta_correcta" class="form-control" value="{{ old('respuesta_correcta', $puntos_control->respuesta_correcta) }}" required>
    </div>
    <button type="submit" class="btn btn-primary">Actualizar</button>
</form>
@endsection
