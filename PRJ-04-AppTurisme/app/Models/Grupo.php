<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Grupo extends Model
{
    protected $table = 'grupos';

    protected $fillable = ['nombre', 'descripcion', 'codigo', 'gimcana_id'];

    /**
     * Relación con los usuarios del grupo
     */
    public function usuarios(): HasMany
    {
        return $this->hasMany(Usuario::class, 'grupo_id');
    }

    public function gimcana(): BelongsTo
    {
        return $this->belongsTo(Gimcana::class, 'gimcana_id');
    }

    /**
     * Genera un código único para el grupo
     */
    public static function generarCodigoUnico(): string
    {
        do {
            $codigo = strtoupper(substr(md5(uniqid()), 0, 6));
        } while (self::where('codigo', $codigo)->exists());

        return $codigo;
    }

    /**
     * Verifica si el grupo está lleno (máximo 4 usuarios)
     */
    public function estaLleno(): bool
    {
        return $this->usuarios()->count() >= 4;
    }

    /**
     * Añade un usuario al grupo si hay espacio
     */
    public function agregarUsuario(Usuario $usuario): bool
    {
        if ($this->estaLleno()) {
            return false;
        }

        $usuario->grupo_id = $this->id;
        return $usuario->save();
    }
}