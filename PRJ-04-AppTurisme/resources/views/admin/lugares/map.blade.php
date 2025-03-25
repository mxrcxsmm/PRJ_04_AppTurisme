@extends('layouts.app')

@section('styles')
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
@endsection

@section('content')
<div class="row">
    <div class="col-12">
        <h1>Mapa de Lugares</h1>
        <div class="form-inline mb-3">
            <label class="mr-2">Filtrar por Etiqueta:</label>
            <select id="filter-etiqueta" class="form-control mr-3">
                <option value="">Todas</option>
                @foreach($etiquetas as $etiqueta)
                    <option value="{{ $etiqueta->id }}">{{ $etiqueta->nombre }}</option>
                @endforeach
            </select>
        </div>
        <div id="map" style="height: 600px; width: 100%;"></div>
    </div>
</div>
@endsection