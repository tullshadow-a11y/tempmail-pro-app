<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inbox;
use App\Models\Message;
use App\Services\InboxManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MailController extends Controller
{
    protected InboxManager $inboxManager;

    public function __construct(InboxManager $inboxManager)
    {
        $this->inboxManager = $inboxManager;
    }

    public function generateInbox(Request $request): JsonResponse
    {
        $userId = $request->user()?->id;
        $inbox = $this->inboxManager->createRandomInbox($userId, 'free');

        return response()->json([
            'email' => $inbox->email,
            'local_part' => $inbox->local_part,
            'domain' => $inbox->domain,
            'expires_at' => $inbox->expires_at->toIso8601String(),
            'expires_in_seconds' => now()->diffInSeconds($inbox->expires_at),
        ]);
    }

    public function createCustomInbox(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'alias' => 'required|string|alpha_dash|max:50',
            'domain' => 'required|string',
        ]);

        $userId = $request->user()?->id;
        $inbox = $this->inboxManager->createCustomInbox(
            $validated['alias'],
            $validated['domain'],
            $userId,
            'pro'
        );

        return response()->json($inbox, 201);
    }

    public function getMessages(string $email): JsonResponse
    {
        $messages = $this->inboxManager->getMessages(strtolower($email));
        return response()->json($messages);
    }

    public function getMessage(string $email, string $messageId): JsonResponse
    {
        $inbox = Inbox::where('email', strtolower($email))->firstOrFail();
        $message = Message::where('inbox_id', $inbox->id)
            ->where('id', $messageId)
            ->firstOrFail();

        $message->update(['is_read' => true]);

        return response()->json($message);
    }

    public function receiveInbound(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'recipient' => 'required|email',
            'sender' => 'required|string',
            'sender_name' => 'nullable|string',
            'subject' => 'nullable|string',
            'body_html' => 'nullable|string',
            'body_text' => 'nullable|string',
            'attachments' => 'nullable|array',
            'size_bytes' => 'nullable|integer',
        ]);

        $recipient = strtolower($validated['recipient']);
        $inbox = Inbox::where('email', $recipient)->where('is_active', true)->first();

        if (!$inbox) {
            return response()->json(['error' => 'Inbox not found or inactive'], 404);
        }

        $message = $this->inboxManager->storeMessage($inbox, $validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Email processed successfully',
            'data' => $message,
        ]);
    }

    public function updateForward(Request $request, string $email): JsonResponse
    {
        $validated = $request->validate([
            'forward_to' => 'required|email',
        ]);

        $inbox = Inbox::where('email', strtolower($email))
            ->where('user_id', $request->user()?->id)
            ->firstOrFail();

        $inbox->update(['forward_to' => $validated['forward_to']]);

        return response()->json([
            'status' => 'success',
            'message' => 'Forwarding email updated successfully',
            'inbox' => $inbox,
        ]);
    }
}
