# Whisper Event

The Whisper event fires when a user sends a private whisper message to
the bot. Whispers are only visible to the sender and the receiver, so
anything the bot sends back using `bot.whisper.send()` will only be
seen by that user.

The Whisper event works almost identically to the Chat event. You get
the same `user` and `message` objects with the same `command()`,
`args()`, and `mentions()` methods. Everything you learned in the
[Chat](./chat.md) page applies here too. The only real difference is
how you respond.

## Event structure

```javascript
bot.on('Whisper', async (user, message) => {

});
```

## Replying to a whisper

To send a whisper back, use `bot.whisper.send()` with the user's ID:

```javascript
bot.on('Whisper', async (user, message) => {
    if (message.command() === '!ping') {
        await bot.whisper.send(user.id, 'Pong! 🏓');
        return;
    }
});
```

Notice you pass `user.id` not `user.username`. The whisper API requires
the user's ID to make sure the message goes to the right person even if
their username has changed.

## When to use whispers vs chat messages

This is worth thinking about when designing your bot. The rule is simple.
Use a chat message when the information is relevant to everyone in the
room. Use a whisper when the information is personal to that specific
user.

A good example is a balance command. The user asks publicly but the
answer only matters to them:

```javascript
bot.on('Chat', async (user, message) => {
    if (message.command() === '!balance') {
        const wallet = await bot.inventory.wallet.get();

        if (!wallet.ok) {
            await bot.whisper.send(user.id, 'Could not fetch balance right now.');
            return;
        }

        // whisper the result so only they see it
        // nobody else in the room needs to know the bot's gold balance
        await bot.whisper.send(user.id, `Bot balance: ${wallet.gold} gold.`);
        return;
    }
});
```

The command is typed in public chat but the response goes privately to
that user. This keeps the room chat clean while still giving them the
information they asked for.

## Long whispers

Just like `bot.message.send()`, `bot.whisper.send()` handles messages
longer than 256 characters automatically by splitting them into multiple
parts and sending them in order. You never need to worry about hitting
the character limit.

## Summary

- The Whisper event provides the same `user` and `message` objects as the [Chat](./chat.md) event
- Use `bot.whisper.send(user.id, text)` to reply privately to the user
- Avoid using `bot.message.send(text)` if the response is intended to be private
- Ideal for handling personal or sensitive information without cluttering the room
- Public messages should be reserved for content intended for all participants
- Long whispers are automatically split into multiple parts, similar to chat messages
