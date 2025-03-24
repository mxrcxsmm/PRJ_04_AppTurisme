<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Muestra el formulario de login.
     */
    public function showLoginForm()
    {
        return view('auth.login');
    }

    /**
     * Procesa el formulario de login.
     */
    public function login(Request $request)
    {
        // Validación sencilla
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Intentar autenticar
        $credentials = $request->only('email', 'password');
        if (Auth::attempt($credentials)) {
            // Autenticación exitosa
            $request->session()->regenerate();
            
            // Redirigir a la zona que quieras, por ejemplo, dashboard de admin
            return redirect()->intended('/admin')
                ->with('success', 'Has iniciado sesión correctamente.');
        }

        // Si falla la autenticación, volvemos al login con un mensaje
        return back()->withErrors([
            'email' => 'Credenciales inválidas.',
        ])->onlyInput('email');
    }

    /**
     * Cierra la sesión del usuario.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')
            ->with('success', 'Has cerrado sesión.');
    }
}
