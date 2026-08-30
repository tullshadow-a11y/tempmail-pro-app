<?php

namespace App\Services;

use App\Models\Domain;
use Illuminate\Support\Facades\Cache;

class DomainManager
{
    public function getRandomDomain(string $type = 'public'): string
    {
        $domains = $this->getActiveDomains($type);
        if (empty($domains)) {
            return '1secmail.com';
        }

        return $domains[array_rand($domains)];
    }

    public function getActiveDomains(string $type = 'public'): array
    {
        return Cache::remember("active_domains_{$type}", 300, function () use ($type) {
            return Domain::where('is_active', true)
                ->where('is_blacklisted', false)
                ->where('type', $type)
                ->pluck('domain')
                ->toArray();
        });
    }

    public function blacklistDomain(string $domainName): bool
    {
        $domain = Domain::where('domain', $domainName)->first();
        if ($domain) {
            $updated = $domain->update(['is_blacklisted' => true, 'is_active' => false]);
            $this->clearCache();
            return $updated;
        }
        return false;
    }

    public function rotateDomains(): void
    {
        Domain::where('is_active', true)->update(['last_used_at' => now()]);
        $this->clearCache();
    }

    public function clearCache(): void
    {
        Cache::forget('active_domains_public');
        Cache::forget('active_domains_private');
        Cache::forget('active_domains_premium');
    }
}
