<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageReceivedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $recipient;
    public array $message;

    public function __construct(string $recipient, array $message)
    {
        $this->recipient = $recipient;
        $this->message = $message;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('inbox.' . md5($this->recipient)),
        ];
    }

    public function broadcastAs(): string
    {
        return 'new-message';
    }
}
