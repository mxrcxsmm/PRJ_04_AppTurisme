<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PuntoControl extends Model
{
    protected $table = 'puntos_control';
    protected $fillable = [
        'nombre',
        'descripcion',
        'latitud',
        'longitud'
    ];

    public function lugar()
    {
        return $this->belongsTo(Lugar::class, 'lugar_id');
    }

    public function usuarios()
    {
        return $this->belongsToMany(Usuario::class, 'usuario_punto')
            ->withPivot('completado', 'fecha_completado')
            ->withTimestamps();
    }
}
