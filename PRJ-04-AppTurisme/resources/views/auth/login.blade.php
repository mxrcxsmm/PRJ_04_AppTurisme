@extends('layouts.app') 
{{-- O si tienes un layout distinto, ajústalo --}}

@section('title', 'Login')

@section('content')

<div class="row justify-content-center mt-5">
    <div class="col-md-4">
        
        <h2>Iniciar Sesión</h2>

        @if ($errors->any())
            <div class="alert alert-danger">
                <ul class="mb-0">
                    @foreach ($errors->all() as $error)
                      <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        @if (session('success'))
            <div class="alert alert-success my-2">
                {{ session('success') }}
            </div>
        @endif

        <form method="POST" action="{{ route('login.post') }}">
            @csrf
            <div class="mb-3">
                <label for="email" class="form-label">Correo electrónico</label>
                <input 
                    type="email" 
                    class="form-control" 
                    name="email" 
                    id="email" 
                    value="{{ old('email') }}" 
                    required 
                    autofocus
                >
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input 
                    type="password" 
                    class="form-control" 
                    name="password" 
                    id="password" 
                    required
                >
            </div>
            <button type="submit" class="btn btn-primary">Acceder</button>
        </form>
    </div>
</div>
@endsection
