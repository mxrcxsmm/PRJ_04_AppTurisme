<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsuarioGrupoTable extends Migration
{
    public function up()
    {
        Schema::create('usuario_grupo', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('usuario_id');
            $table->unsignedInteger('grupo_id');
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['usuario_id', 'grupo_id']);

            $table->foreign('usuario_id')
                  ->references('id')->on('usuarios')
                  ->onDelete('cascade');

            $table->foreign('grupo_id')
                  ->references('id')->on('grupos')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('usuario_grupo');
    }
}
