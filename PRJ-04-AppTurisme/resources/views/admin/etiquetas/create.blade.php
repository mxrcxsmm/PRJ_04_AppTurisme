@extends('layouts.app')

@section('title', 'Crear Etiqueta')

@section('content')
    <h2>Crear Etiqueta</h2>

    @if($errors->any())
      <div class="alert alert-danger" style="display: none;" id="serverErrors">
          <ul>
              @foreach($errors->all() as $error)
                  <li>{{ $error }}</li>
              @endforeach
          </ul>
      </div>
    @endif

    <form action="{{ route('admin.etiquetas.store') }}" method="POST" id="createEtiquetaForm">
        @csrf
        <div class="mb-3">
            <label for="nombre" class="form-label">Nombre:</label>
            <input type="text" name="nombre" id="nombre" class="form-control" value="{{ old('nombre') }}"  onblur="validateNombre()">
            <small id="nombreError" class="text-danger">@error('nombre') {{ $message }} @enderror</small>
        </div>
        <div class="mb-3">
            <label for="color" class="form-label">Color:</label>
            <input type="text" name="color" id="color" class="form-control" value="{{ old('color') }}" placeholder="#FFFFFF"  onblur="validateColor()">
            <small id="colorError" class="text-danger">@error('color') {{ $message }} @enderror</small>
        </div>
        <button type="submit" class="btn btn-success">Guardar</button>
        <a href="{{ route('admin.etiquetas.index') }}" class="btn btn-secondary">Volver</a>
    </form>
@endsection
