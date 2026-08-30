<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('domains', function (Blueprint $table) {
            $table->id();
            $table->string('domain')->unique();
            $table->enum('type', ['public', 'premium'])->default('public');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('plan_name');
            $table->timestamp('expires_at');
            $table->timestamps();
        });

        Schema::create('custom_aliases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('alias')->unique();
            $table->string('forward_to');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('custom_aliases');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('domains');
    }
};
