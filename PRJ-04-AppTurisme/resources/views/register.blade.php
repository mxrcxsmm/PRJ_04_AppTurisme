<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro</title>
    <!-- Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/registro.css') }}">
</head>

<body>
    <div class="login-container">
        <img class="imagen" src="{{ asset('img/logo.png') }}" alt="Inspector Gadget">
        <form action="{{ route('register') }}" method="POST">
            @csrf

            <!-- Nombre -->
            <div class="form-group">
                <input type="text" name="nombre" class="form-control" placeholder="Nombre completo" value="{{ old('nombre') }}">
                @if ($errors->has('nombre'))
                    <span class="text-danger">{{ $errors->first('nombre') }}</span>
                @endif
            </div>

            <!-- Email -->
            <div class="form-group">
                <input type="email" name="email" class="form-control" placeholder="Email" value="{{ old('email') }}">
                @if ($errors->has('email'))
                    <span class="text-danger">{{ $errors->first('email') }}</span>
                @endif
            </div>

            <!-- Contraseña -->
            <div class="form-group">
                <input type="password" name="password" class="form-control" placeholder="Contraseña">
                @if ($errors->has('password'))
                    <span class="text-danger">{{ $errors->first('password') }}</span>
                @endif
            </div>

            <!-- Confirmar Contraseña -->
            <div class="form-group">
                <input type="password" name="password_confirmation" class="form-control" placeholder="Confirmar contraseña">
                @if ($errors->has('password_confirmation'))
                    <span class="text-danger">{{ $errors->first('password_confirmation') }}</span>
                @endif
            </div>

            <!-- Botón de Registro -->
            <button type="submit" class="btn btn-primary btn-block">REGISTRARME</button>
        </form>
        <a href="{{ route('login') }}">¿Ya tienes una cuenta? Inicia sesión aquí</a>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

</html>