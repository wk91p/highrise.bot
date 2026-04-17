# bot.whisper

The `bot.whisper` API handles sending private messages to specific users
in the room. Whispers are only visible to the sender and the receiver.
No one else in the room can see them.

## What lives on bot.whisper

```javascript
bot.whisper.send()   // send a private whisper to a specific user
```

One method. It works almost exactly like `bot.message.send()` except you
also tell it who to send the message to.

## send()

Sends a private whisper that only the target user can see.

```javascript
await bot.whisper.send(userId, 'This is just between us.');
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The ID of the user to whisper |
| `message` | `string` | The text you want the bot to whisper |

### Returns

An [`AcknowledgmentResponse`](#acknowledgmentresponse) with `ok` and
`error` properties.

## Basic usage

```javascript
// whisper a welcome message to a new user
bot.on('UserJoined', async (user) => {
    await bot.whisper.send(user.id, 'Welcome! Type !help to see commands.');
});

// respond to a command with whisper
bot.on('Chat', async (user, message) => {
    const cmd = message.command()

    if (cmd === '!ping') {
        await bot.whisper.send(user.id, 'Pong! 🏓');
        return;
    }
});
```

## When to whisper vs send to chat

| Use `bot.message.send()` when... | Use `bot.whisper.send()` when... |
|----------------------------------|----------------------------------|
| Everyone should see it | Only one person needs to see it |
| Announcing something | Giving private instructions |
| Responding to public commands | Responding to whisper commands |
| Welcoming someone publicly | Sharing personal information |

A common pattern is listening for a command in public chat but
responding privately:

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command()

    if (cmd === '!balance') {
        const wallet = await bot.inventory.wallet.get();

        if (!wallet.ok) {
            await bot.whisper.send(user.id, 'Could not fetch balance.');
            return;
        }

        // whisper the result so only they see it
        await bot.whisper.send(user.id, `Bot balance: ${wallet.gold} gold.`);
        return;
    }
});
```

The user types `!balance` publicly but the answer comes to them
privately. This keeps the room chat clean.

## Important things to know

**Use the user ID, not the username.** `bot.whisper.send()` requires the
user's unique ID.

**Long messages are split automatically.** Just like `bot.message.send()`,
whispers over 256 characters are split into multiple messages.

## AcknowledgmentResponse

Same response type as `bot.message.send()`:

```typescript
{
    ok: boolean;           // true if the whisper was sent
    error: string | null;  // what went wrong if it failed
    hasError(): boolean;   // returns true if error exists
}
```

## Summary

- `bot.whisper.send(userId, message)` sends a private message to one user
- Use the user's `id` from the event, not their `username`
- Long messages are automatically split like `bot.message.send()`
- Whisper responses keep the room chat clean when information is personal
- The return type is identical to `bot.message.send()`