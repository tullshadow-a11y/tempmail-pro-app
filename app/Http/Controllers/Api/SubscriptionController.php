<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'plan' => 'required|in:pro,vip',
            'payment_id' => 'required|string',
        ]);

        $user = $request->user();

        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan' => $validated['plan'],
            'status' => 'active',
            'starts_at' => now(),
            'expires_at' => $validated['plan'] === 'vip' ? now()->addYear() : now()->addMonth(),
            'payment_id' => $validated['payment_id'],
            'features' => [
                'custom_aliases' => $validated['plan'] === 'vip' ? -1 : 10,
                'email_forwarding' => true,
                'no_ads' => true,
            ],
        ]);

        return response()->json([
            'status' => 'success',
            'subscription' => $subscription,
        ], 201);
    }

    public function current(Request $request): JsonResponse
    {
        $subscription = Subscription::where('user_id', $request->user()?->id)
            ->where('status', 'active')
            ->where('expires_at', '>', now())
            ->latest('starts_at')
            ->first();

        if (!$subscription) {
            return response()->json([
                'plan' => 'free',
                'status' => 'inactive',
            ]);
        }

        return response()->json($subscription);
    }
}
