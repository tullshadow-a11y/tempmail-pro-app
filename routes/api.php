<?php

use App\Http\Controllers\Api\MailController;
use Illuminate\Support\Facades\Route;

Route::post('/webhook/inbound-mail', [MailController::class, 'receiveInbound']);
Route::get('/generate-inbox', [MailController::class, 'generateInbox']);
Route::get('/inbox/{email}/messages', [MailController::class, 'getMessages']);
