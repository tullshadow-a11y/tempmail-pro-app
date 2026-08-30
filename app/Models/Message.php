<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'inbox_id',
        'external_id',
        'sender',
        'sender_name',
        'subject',
        'body_html',
        'body_text',
        'attachments',
        'size_bytes',
        'received_at',
        'is_read',
    ];

    protected $casts = [
        'attachments' => 'array',
        'received_at' => 'datetime',
        'is_read' => 'boolean',
    ];

    public function inbox(): BelongsTo
    {
        return $this->belongsTo(Inbox::class);
    }
}
