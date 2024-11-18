<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tour_prices', function (Blueprint $table) {
            $table->id();
            $table->float('3-stars|2');
            $table->float('4-stars|2');
            $table->float('4&5-stars|2');
            $table->float('5-stars|2');
            $table->float('3-stars|3-4');
            $table->float('4-stars|3-4');
            $table->float('4&5-stars|3-4');
            $table->float('5-stars|3-4');
            $table->float('3-stars|5<n');
            $table->float('4-stars|5<n');
            $table->float('4&5-stars|5<n');
            $table->float('5-stars|5<n');
            $table->unsignedBigInteger('tour_id');
            $table->foreign('tour_id')->references('id')->on('tours')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tour_prices');
    }
};
