<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageReceivedEvent;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class MailController extends Controller
{
    public function generateInbox(): JsonResponse
    {
        $domain = DB::table('domains')
            ->where('type', 'public')
            ->where('is_active', true)
            ->inRandomOrder()
            ->value('domain') ?? '1secmail.com';

        $username = Str::random(10);
        $email = strtolower($username . '@' . $domain);
        $ttl = 600; // 10 minutes TTL

        Redis::setex("inbox:{$email}:meta", $ttl, json_encode([
            'email' => $email,
            'created_at' => now()->toIso8601String(),
            'expires_at' => now()->addSeconds($ttl)->toIso8601String(),
        ]));

        return response()->json([
            'email' => $email,
            'expires_in_seconds' => $ttl,
            'expires_at' => now()->addSeconds($ttl)->toIso8601String(),
        ]);
    }

    public function receiveInbound(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'recipient' => 'required|email',
            'sender' => 'required|string',
            'subject' => 'nullable|string',
            'body' => 'nullable|string',
        ]);

        $recipient = strtolower($validated['recipient']);
        $msgId = uniqid('msg_', true);

        $messageData = [
            'id' => $msgId,
            'recipient' => $recipient,
            'sender' => $validated['sender'],
            'from' => $validated['sender'],
            'subject' => $validated['subject'] ?? '(No Subject)',
            'body' => $validated['body'] ?? '',
            'textBody' => $validated['body'] ?? '',
            'date' => now()->toIso8601String(),
            'created_at' => now()->toIso8601String(),
        ];

        $cacheKey = "inbox:{$recipient}";

        $messages = json_decode(Redis::get($cacheKey) ?: '[]', true);
        array_unshift($messages, $messageData);

        Redis::setex($cacheKey, 600, json_encode($messages));

        event(new MessageReceivedEvent($recipient, $messageData));

        return response()->json([
            'status' => 'success',
            'message' => 'Email received successfully',
            'data' => $messageData,
        ]);
    }

    public function getMessages(string $email): JsonResponse
    {
        $recipient = strtolower($email);
        $cacheKey = "inbox:{$recipient}";

        $messages = json_decode(Redis::get($cacheKey) ?: '[]', true);

        return response()->json($messages);
    }
}
