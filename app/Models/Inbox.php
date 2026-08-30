<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inbox extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'local_part',
        'domain',
        'user_id',
        'plan',
        'expires_at',
        'is_active',
        'forward_to',
        'metadata',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
        'metadata' => 'array',
    ];

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
