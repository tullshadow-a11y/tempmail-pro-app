<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inbox_id')->constrained()->onDelete('cascade');
            $table->string('external_id')->nullable();
            $table->string('sender');
            $table->string('sender_name')->nullable();
            $table->string('subject')->nullable();
            $table->longText('body_html')->nullable();
            $table->longText('body_text')->nullable();
            $table->json('attachments')->nullable();
            $table->unsignedBigInteger('size_bytes')->default(0);
            $table->timestamp('received_at')->useCurrent();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
