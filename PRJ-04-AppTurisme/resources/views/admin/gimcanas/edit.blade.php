@extends('layouts.app')

@section('title', 'Editar Gimcana')

@section('content')
<h1>Editar Gimcana</h1>

@if($errors->any())
  <div class="alert alert-danger" style="display: none;" id="serverErrors">
    <ul>
      @foreach($errors->all() as $error)
          <li>{{ $error }}</li>
      @endforeach
    </ul>
  </div>
@endif

<form action="{{ route('admin.gimcanas.update', $gimcana->id) }}" method="POST" id="editGimcanaForm">
    @csrf
    @method('PUT')
    <div class="form-group">
        <label for="nombre" class="form-label">Nombre:</label>
        <input type="text" name="nombre" id="nombre" class="form-control"
               value="{{ old('nombre', $gimcana->nombre) }}"  onblur="validateNombre()">
        <small id="nombreError" class="text-danger">@error('nombre') {{ $message }} @enderror</small>
    </div>
    <div class="form-group">
        <label for="descripcion" class="form-label">Descripción:</label>
        <textarea name="descripcion" id="descripcion" class="form-control" rows="3"  onblur="validateDescripcion()">{{ old('descripcion', $gimcana->descripcion) }}</textarea>
        <small id="descripcionError" class="text-danger">@error('descripcion') {{ $message }} @enderror</small>
    </div>
    <div class="form-group">
        <label for="puntos_control">Selecciona Puntos de Control:</label>
        <select name="puntos_control[]" id="puntos_control" class="form-control" multiple  onchange="validatePuntosControl()">
            @foreach($puntos as $punto)
                <option value="{{ $punto->id }}" 
                    {{ in_array($punto->id, $puntosSeleccionados) ? 'selected' : '' }}>
                    {{ $punto->lugar ? $punto->lugar->nombre : 'Lugar desconocido' }}
                </option>
            @endforeach
        </select>
        <small id="puntosControlError" class="text-danger">@error('puntos_control') {{ $message }} @enderror</small>
    </div>
    <button type="submit" class="btn btn-primary">Actualizar</button>
    <a href="{{ route('admin.gimcanas.index') }}" class="btn btn-secondary">Volver</a>
</form>
@endsection
