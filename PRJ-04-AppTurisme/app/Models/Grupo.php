<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grupo extends Model
{
    protected $table = 'grupos';

    protected $fillable = ['nombre', 'descripcion', 'codigo', 'gimcana_id'];

    // Relación con usuarios
    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'grupo_id');
    }

    // Relación con gimcana
    public function gimcana()
    {
        return $this->belongsTo(Gimcana::class, 'gimcana_id');
    }
}
