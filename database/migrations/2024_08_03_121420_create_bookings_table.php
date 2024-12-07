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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id(); // Auto-incrementing ID
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('country');
            $table->string('region');
            $table->integer('number_of_adults');
            $table->integer('number_of_children')->default(0);
            $table->integer('number_of_rooms');
            $table->date('arrival_date');
            $table->enum('tour_level', ['3-stars', '4-stars', '4&5-stars', '5-stars']);
            $table->text('special_requests')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'canceled', 'completed'])->default('pending');
            $table->decimal('total_price', 10, 2)->nullable();
            $table->decimal('discount', 5, 2)->default(0);
            $table->string('reference_code')->unique();
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
        Schema::dropIfExists('bookings');
    }
};
