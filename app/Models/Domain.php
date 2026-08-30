<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Domain extends Model
{
    use HasFactory;

    protected $fillable = [
        'domain',
        'type',
        'is_active',
        'is_blacklisted',
        'last_used_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_blacklisted' => 'boolean',
        'last_used_at' => 'datetime',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->where('is_blacklisted', false);
    }

    public function scopePublic(Builder $query): Builder
    {
        return $query->where('type', 'public');
    }

    public function scopePremium(Builder $query): Builder
    {
        return $query->where('type', 'premium');
    }
}
