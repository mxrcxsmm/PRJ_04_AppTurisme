<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsuarioPuntoTable extends Migration
{
    public function up()
    {
        Schema::create('usuario_punto', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('usuario_id');
            $table->unsignedInteger('punto_id');
            $table->boolean('completado')->default(0);
            $table->timestamp('fecha_completado');
            
            $table->foreign('usuario_id')
                  ->references('id')->on('usuarios')
                  ->onDelete('cascade');

            $table->foreign('punto_id')
                  ->references('id')->on('puntos_control')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('usuario_punto');
    }
}
