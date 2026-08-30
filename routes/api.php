<?php

use App\Http\Controllers\Api\MailController;
use App\Http\Controllers\Api\SubscriptionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/generate-inbox', [MailController::class, 'generateInbox']);
Route::get('/inbox/{email}/messages', [MailController::class, 'getMessages']);
Route::get('/inbox/{email}/messages/{messageId}', [MailController::class, 'getMessage']);
Route::post('/webhook/inbound-mail', [MailController::class, 'receiveInbound']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes (auth:sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/inbox/custom', [MailController::class, 'createCustomInbox']);
    Route::post('/inbox/{email}/forward', [MailController::class, 'updateForward']);
    Route::post('/subscriptions/subscribe', [SubscriptionController::class, 'subscribe']);
    Route::get('/subscriptions/current', [SubscriptionController::class, 'current']);
});
