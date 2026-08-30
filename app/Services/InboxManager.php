<?php

namespace App\Services;

use App\Events\MessageReceivedEvent;
use App\Models\Inbox;
use App\Models\Message;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class InboxManager
{
    protected DomainManager $domainManager;

    public function __construct(DomainManager $domainManager)
    {
        $this->domainManager = $domainManager;
    }

    public function createRandomInbox(?int $userId = null, string $plan = 'free'): Inbox
    {
        $domain = $this->domainManager->getRandomDomain($plan === 'free' ? 'public' : 'premium');
        $localPart = Str::random(10);
        $email = strtolower("{$localPart}@{$domain}");

        return Inbox::create([
            'email' => $email,
            'local_part' => $localPart,
            'domain' => $domain,
            'user_id' => $userId,
            'plan' => $plan,
            'expires_at' => now()->addMinutes(10),
            'is_active' => true,
        ]);
    }

    public function createCustomInbox(string $alias, string $domain, ?int $userId = null, string $plan = 'pro'): Inbox
    {
        $email = strtolower("{$alias}@{$domain}");

        return Inbox::create([
            'email' => $email,
            'local_part' => $alias,
            'domain' => $domain,
            'user_id' => $userId,
            'plan' => $plan,
            'expires_at' => $plan === 'vip' ? now()->addYear() : now()->addDays(30),
            'is_active' => true,
        ]);
    }

    public function storeMessage(Inbox $inbox, array $data): Message
    {
        $cleanHtml = isset($data['body_html']) ? $this->sanitizeHtml($data['body_html']) : null;

        $message = Message::create([
            'inbox_id' => $inbox->id,
            'external_id' => $data['external_id'] ?? null,
            'sender' => $data['sender'],
            'sender_name' => $data['sender_name'] ?? null,
            'subject' => $data['subject'] ?? '(No Subject)',
            'body_html' => $cleanHtml,
            'body_text' => $data['body_text'] ?? null,
            'attachments' => $data['attachments'] ?? [],
            'size_bytes' => $data['size_bytes'] ?? 0,
            'received_at' => now(),
            'is_read' => false,
        ]);

        Cache::forget("inbox_messages_{$inbox->email}");

        event(new MessageReceivedEvent($inbox->email, $message->toArray()));

        return $message;
    }

    public function getMessages(string $email): array
    {
        return Cache::remember("inbox_messages_{$email}", 60, function () use ($email) {
            $inbox = Inbox::where('email', $email)->first();
            if (!$inbox) {
                return [];
            }

            return $inbox->messages()->latest('received_at')->get()->toArray();
        });
    }

    public function cleanupExpired(): int
    {
        $expiredCount = Inbox::where('expires_at', '<', now())
            ->where('plan', 'free')
            ->where('is_active', true)
            ->update(['is_active' => false]);

        return $expiredCount;
    }

    public function sanitizeHtml(string $html): string
    {
        $cleaned = strip_tags($html, '<p><br><a><b><i><strong><em><ul><ol><li><div><span><h1><h2><h3><h4><h5><h6><table><tr><td><th><img><blockquote><code><pre>');
        return preg_replace('/on[a-z]+\s*=\s*"[^"]*"/i', '', $cleaned);
    }
}
