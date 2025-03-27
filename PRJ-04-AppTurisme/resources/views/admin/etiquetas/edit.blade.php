@extends('layouts.app')

@section('content')
<h1>Editar Etiqueta</h1>

@if($errors->any())
  <div class="alert alert-danger" style="display: none;" id="serverErrors">
    <ul>
      @foreach($errors->all() as $err)
        <li>{{ $err }}</li>
      @endforeach
    </ul>
  </div>
@endif

<form action="{{ route('admin.etiquetas.update', $etiqueta->id) }}" method="POST" id="editEtiquetaForm">
    @csrf
    @method('PUT')
    <div class="form-group">
        <label for="nombre">Nombre</label>
        <input type="text" name="nombre" id="nombre" class="form-control" value="{{ old('nombre', $etiqueta->nombre) }}"  onblur="validateNombre()">
        <small id="nombreError" class="text-danger">@error('nombre') {{ $message }} @enderror</small>
    </div>
    <div class="form-group">
        <label for="color">Color (ej: #FF0000)</label>
        <input type="text" name="color" id="color" class="form-control" value="{{ old('color', $etiqueta->color) }}"  onblur="validateColor()">
        <small id="colorError" class="text-danger">@error('color') {{ $message }} @enderror</small>
    </div>
    <button type="submit" class="btn btn-primary">Actualizar</button>
</form>
@endsection
