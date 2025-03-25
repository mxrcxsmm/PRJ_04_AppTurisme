@extends('layouts.app')

@section('content')
<h1>Crear Punto de Control</h1>

@if($errors->any())
  <div class="alert alert-danger" style="display: none;" id="serverErrors">
    <ul>
      @foreach($errors->all() as $err)
        <li>{{ $err }}</li>
      @endforeach
    </ul>
  </div>
@endif

<form action="{{ route('admin.puntos-control.store') }}" method="POST" id="createPuntoControlForm">
    @csrf
    <div class="form-group">
        <label for="lugar_id">Lugar:</label>
        <select name="lugar_id" id="lugar_id" class="form-control"  onchange="validateLugar()">
            <option value="">-- Selecciona un lugar --</option>
            @foreach($lugares as $lugar)
            <option value="{{ $lugar->id }}" {{ old('lugar_id') == $lugar->id ? 'selected' : '' }}>
                {{ $lugar->nombre }}
            </option>
            @endforeach
        </select>
        <small id="lugarError" class="text-danger">@error('lugar_id') {{ $message }} @enderror</small>
    </div>

    <div class="form-group">
        <label for="descripcion">Descripción:</label>
        <textarea name="descripcion" id="descripcion" class="form-control" rows="2"  onblur="validateDescripcion()">{{ old('descripcion') }}</textarea>
        <small id="descripcionError" class="text-danger">@error('descripcion') {{ $message }} @enderror</small>
    </div>

    <div class="form-group">
        <label for="pista">Pista:</label>
        <textarea name="pista" id="pista" class="form-control" rows="2"  onblur="validatePista()">{{ old('pista') }}</textarea>
        <small id="pistaError" class="text-danger">@error('pista') {{ $message }} @enderror</small>
    </div>

    <div class="form-group">
        <label for="prueba">Prueba:</label>
        <textarea name="prueba" id="prueba" class="form-control" rows="2"  onblur="validatePrueba()">{{ old('prueba') }}</textarea>
        <small id="pruebaError" class="text-danger">@error('prueba') {{ $message }} @enderror</small>
    </div>

    <button type="submit" class="btn btn-primary">Guardar</button>
</form>
@endsection