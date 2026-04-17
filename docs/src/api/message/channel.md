# bot.channel

The `bot.channel` API handles hidden communication between bots in the
same room. Messages sent here are invisible to regular players. Only
other bots in the room can see them. This is useful for coordinating
multiple bots without cluttering the public chat.

## What lives on bot.channel

```javascript
bot.channel.send()   // send a hidden message to all other bots in the room
```

One method. Simple.

## send()

Sends a message to the hidden channel that only other bots can see.

```javascript
await bot.channel.send('Player 1 wins', ['announcement']);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `message` | `string` | The content to send (can be plain text or stringified JSON) |
| `tags` | `string[]` | Array of strings for filtering and categorization |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

### What tags are for

Tags let you categorize messages so receiving bots can filter what they
care about without parsing every message:

```javascript
// sending bot
await bot.channel.send('User Unfairly was muted', ['moderation', 'log']);
await bot.channel.send('New high score: 9999', ['game', 'leaderboard']);
await bot.channel.send(JSON.stringify({ action: 'sync', data: {} }), ['state']);
```

The receiving bot can then check if a message is relevant:

```javascript
bot.on('Channel', (botId, message, tags) => {
    // only care about moderation messages
    if (tags.includes('moderation')) {
        console.log(`Mod action from ${botId}: ${message}`);
    }

    // ignore everything else
});
```

## Receiving channel messages

Listen to the Channel event to receive messages from other bots:

```javascript
bot.on('Channel', (botId, message, tags) => {
    console.log(`[${botId}]: ${message}`);
    console.log(`Tags: ${tags.join(', ')}`);
});
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `botId` | `string` | The ID of the bot that sent the message |
| `message` | `string` | The raw message content |
| `tags` | `string[]` | The tags the sender attached |

> [!IMPORTANT]
> The sender bot does **not** receive its own messages. You do not need
> to filter out your own bot ID.

> [!IMPORTANT]
> The `message` here is a raw string, not a `Message` object. Methods
> like `.command()`, `.args()`, and `.mentions()` do not exist. If you
> send structured data, parse it manually with `JSON.parse()`.

## Basic usage

### Syncing state between bots

```javascript
// Bot A: announces when it mutes someone
bot.on('Chat', async (user, message) => {
    if (message.command() === '!mute') {
        const target = message.args(0);
        // ... mute logic ...
        await bot.channel.send(`${target} was muted by ${user.username}`, ['moderation']);
    }
});

// Bot B: listens for moderation actions from other bots
bot.on('Channel', (botId, message, tags) => {
    if (tags.includes('moderation')) {
        console.log(`Bot ${botId} reports: ${message}`);
    }
});
```

### Sending structured data

Tags help with filtering but the message itself can be JSON for complex
data:

```javascript
// Sending bot
bot.on("Tip", async (sender, receiver, currency) => {
    const data = {
        event: 'tip_received',
        from: sender.username,
        amount: currency.amount,
        timestamp: Date.now()
    };

    await bot.channel.send(JSON.stringify(data), ['economy', 'tip']);
})

// Receiving bot
bot.on('Channel', (botId, message, tags) => {
    if (tags.includes('economy') && tags.includes('tip')) {
        const data = JSON.parse(message);
        console.log(`${data.from} tipped ${data.amount} gold`);
    }
});
```

### Using tags for different categories

A single bot can handle multiple types of channel messages:

```javascript
bot.on('Channel', async (botId, message, tags) => {
    if (tags.includes('announcement')) {
        // forward important announcements to chat
        await bot.message.send(`[System] ${message}`);
        return;
    }

    if (tags.includes('moderation')) {
        // log moderation actions from other bots
        log.info('Channel', `Mod action from ${botId}: ${message}`);
        return;
    }

    if (tags.includes('debug')) {
        // only log debug messages in development
        log.debug('Channel', `[${botId}] ${message}`);
        return;
    }
});
```

## Complete example

Here is a bot that uses the channel to coordinate a simple game between
multiple bots:

```javascript
// Bot 1: Game host
bot.on('Chat', (user, message) => {
    if (message.command() === '!startgame') {
        await bot.message.send('Game starting in 3...');
        await bot.channel.send('countdown:3', ['game', 'countdown']);

        await bot.utils.sleep(1000);
        await bot.message.send('2...');
        await bot.channel.send('countdown:2', ['game', 'countdown']);

        await bot.utils.sleep(1000);
        await bot.message.send('1...');
        await bot.channel.send('countdown:1', ['game', 'countdown']);

        await bot.utils.sleep(1000);
        await bot.message.send('GO!');
        await bot.channel.send('game:started', ['game', 'start']);
    }
});

// Bot 2: Game participant
bot.on('Channel',  async (botId, message, tags) => {
    if (tags.includes('game')) {
        if (tags.includes('countdown')) {
            const [, seconds] = message.split(':');
            console.log(`Countdown: ${seconds}`);
        }

        if (tags.includes('start')) {
            await bot.message.send('I am ready!');
        }
    }
});
```

## Important things to know

**Channel messages are bot-only.** Regular players cannot see them. This
makes the channel perfect for bot coordination, logging, and state
synchronization without spamming users.

**The sender does not see their own message.** This is intentional. You
do not need to check `if (botId === myBotId) return` because you will
never receive your own messages.

**Tags are your filtering system.** Without tags, every bot would have
to parse every message to decide if it cares. Tags make this efficient.
Choose consistent tag names across all your bots.

**Messages can be anything.** Plain text, JSON, or any string format
your bots agree on. The SDK does not enforce any structure.

**There is no built-in reply system.** Unlike DMs where you have a
conversation ID to reply to, channel messages are broadcast to all bots.
If you need a specific bot to respond, include a target bot ID in your
message payload.

## AcknowledgmentResponse

```typescript
{
    ok: boolean;           // true if the message was sent
    error: string | null;  // what went wrong if it failed
    hasError(): boolean;   // returns true if error exists
}
```

## Summary

- `bot.channel.send(message, tags)` sends a hidden message to all other bots in the room
- Tags are used for filtering and categorizing messages
- Listen with `bot.on('Channel', (botId, message, tags) => {})`
- The sender never receives their own messages
- The message is a raw string, not a `Message` object
- Perfect for bot-to-bot coordination, logging, and state sync
- Use JSON for structured data when needed