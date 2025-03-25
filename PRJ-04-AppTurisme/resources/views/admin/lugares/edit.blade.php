@extends('layouts.app')

@section('content')
<h1>Editar Lugar</h1>

@if($errors->any())
    <div class="alert alert-danger" style="display: none;" id="serverErrors">
        <ul>
          @foreach($errors->all() as $error)
             <li>{{ $error }}</li>
          @endforeach
        </ul>
    </div>
@endif

<form action="{{ route('admin.lugares.update', $lugare->id) }}" method="POST" enctype="multipart/form-data" id="editLugarForm">
    @csrf
    @method('PUT')
    <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input type="text" name="nombre" id="nombre" class="form-control" value="{{ old('nombre', $lugare->nombre) }}"  onblur="validateNombre()">
        <small class="text-danger" id="nombreError">@error('nombre') {{ $message }} @enderror</small>
    </div>

    <div class="form-group">
        <label for="descripcion">Descripción:</label>
        <textarea name="descripcion" id="descripcion" class="form-control" rows="3"  onblur="validateDescripcion()">{{ old('descripcion', $lugare->descripcion) }}</textarea>
        <small class="text-danger" id="descripcionError">@error('descripcion') {{ $message }} @enderror</small>
    </div>

    <div class="form-group">
        <label for="direccion">Dirección:</label>
        <input type="text" name="direccion" id="direccion" class="form-control" value="{{ old('direccion', $lugare->direccion) }}"  onblur="validateDireccion()">
        <small class="text-danger" id="direccionError">@error('direccion') {{ $message }} @enderror</small>
        <button type="button" class="btn btn-info mt-2" id="btn-geocode">Obtener coordenadas</button>
    </div>

    <div class="form-group">
        <label for="latitud">Latitud:</label>
        <input type="text" name="latitud" id="latitud" class="form-control" value="{{ old('latitud', $lugare->latitud) }}"  onblur="validateLatitud()">
        <small class="text-danger" id="latitudError">@error('latitud') {{ $message }} @enderror</small>
    </div>

    <div class="form-group">
        <label for="longitud">Longitud:</label>
        <input type="text" name="longitud" id="longitud" class="form-control" value="{{ old('longitud', $lugare->longitud) }}"  onblur="validateLongitud()">
        <small class="text-danger" id="longitudError">@error('longitud') {{ $message }} @enderror</small>
    </div>

    <div class="form-group">
        <label>Icono actual:</label><br>
        @if($lugare->marker)
            <img src="{{ asset($lugare->marker) }}" alt="Icono" width="60">
        @endif
    </div>

    <div class="form-group">
        <label for="marker">Cambiar icono:</label>
        <input type="file" name="marker" id="marker" class="form-control-file" onchange="validateMarkerEdit()">
        <small class="text-danger" id="markerError">@error('marker') {{ $message }} @enderror</small>
    </div>

    <div class="form-group">
        <label for="etiquetas">Etiquetas:</label>
        <select name="etiquetas[]" id="etiquetas" class="form-control" multiple onchange="validateEtiquetas()">
            @foreach($etiquetas as $etiqueta)
            <option value="{{ $etiqueta->id }}" {{ in_array($etiqueta->id, $etiquetasSeleccionadas) ? 'selected' : '' }}>
                {{ $etiqueta->nombre }}
            </option>
            @endforeach
        </select>
        <small class="text-danger" id="etiquetasError">@error('etiquetas') {{ $message }} @enderror</small>
    </div>

    <button type="submit" class="btn btn-primary">Actualizar</button>
</form>
</br>
@endsection