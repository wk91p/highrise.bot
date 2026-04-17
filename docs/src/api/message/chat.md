# bot.message

The `bot.message` API handles everything related to sending messages in
the room. It is the most common way your bot will communicate with users.
This page covers what it can do and how to use it properly.

## What lives on bot.message

```javascript
bot.message.send()   // send a public message to everyone in the room
```

That is it. One method. But it is the one you will use more than any
other.

## send()

Sends a message that everyone in the room can see.

```javascript
await bot.message.send('Hello everyone!');
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `message` | `string` | The text you want the bot to say |

### Returns

An [`AcknowledgmentResponse`](#acknowledgmentresponse). This is the same
response object covered in the [Requests and Responses](../concepts/requests-responses.md)
chapter. It tells you whether the message was sent successfully.

## Basic usage

The simplest possible use is sending a single message:

```javascript
await bot.message.send('Hello, Highrise!');
```

This is what you will do most of the time. Call it and move on.

## Real world example

Here is a complete Chat handler that uses `bot.message.send()` to
respond to a command:

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!ping') {
        await bot.message.send('Pong! 🏓');
        return;
    }

    if (cmd === '!users') {
        const count = await bot.room.users.count();
        await bot.message.send(`There are ${count} users in the room right now.`);
        return;
    }

    if (cmd === '!say') {
        const text = message.args().join(' ');

        if (!text) {
            await bot.message.send('Usage: !say <message>');
            return;
        }

        await bot.message.send(text);
        return;
    }
});
```

## Important things to know

**Long messages are split for you.** Highrise has a 256 character limit
per message. If your message is longer than that, `bot.message.send()`
splits it into chunks and sends each one in order. You do not need to
handle this yourself.

## AcknowledgmentResponse

Every call to `bot.message.send()` returns this object:

```typescript
{
    ok: boolean;           // true if the message was sent
    error: string | null;  // what went wrong if it failed
    hasError(): boolean;   // helper method, same as !ok
}
```

## Summary

- `bot.message.send()` is the only method you need to send public messages
- It returns an `AcknowledgmentResponse` with `ok` and `error` properties
- Messages over 256 characters are automatically split and sent in order
- Always use `await` when calling `bot.message.send()`
- The bot's own messages are filtered out of the Chat event automatically
- Check `result.ok` for important messages, skip it for casual ones