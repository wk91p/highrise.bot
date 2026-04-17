# Direct Event

The Direct event fires when a user sends the bot a direct message from
outside the room. Unlike Chat and Whisper which happen inside the room,
direct messages are private conversations between the bot and a user
that exist across the entire Highrise platform.

## Event structure

```javascript
bot.on('Direct', async (user, message, conversation) => {
    
});
```

## The user object
```javascript
bot.on('Direct', async (user, message, conversation) => {
    console.log(user.id)        // the sender's user ID
    console.log(user.username)  // always null — see below
});
```

## Why username is always null

When Highrise sends the Direct event over the WebSocket, it only
includes the sender's user ID. The username is never provided. This
means `user.username` will always be `null` in this event and you
should never rely on it.

If you need the username, you can look the user up in the room:

```javascript
bot.on('Direct', async (user, message, conversation) => {
    const found = await bot.room.users.find(user.id);
    const username = found?.user.username || 'Unknown';

    await bot.direct.send(conversation.id, `Hey ${username}!`);
});
```

Keep in mind that `bot.room.users.find()` only works if the user is
currently in the same room as the bot. If they sent the DM from a
different room, `found` will be `null`, we will cover how to fetch from outside the room later on so stick around.

## the message object
for more details about this object read [The Message Object](../concepts/message-object.md) page
```javascript
bot.on('Direct', async (user, message, conversation) => {
    console.log(message.content)    // what they sent
    console.log(message.command())  // first word
    console.log(message.args())     // everything after
    console.log(message.mentions()) // all mentions in the message (@ stripped)
});
```

## the conversation object

```javascript
bot.on('Direct', async (user, message, conversation) => {
    console.log(conversation.id)                   // the conversation ID needed to reply
    console.log(conversation.is_new_conversation)  // true if this is the first message ever
});
```

## Replying to a direct message

To reply, use `bot.direct.send()` with the conversation ID:

```javascript
bot.on('Direct', async (user, message, conversation) => {
    const convId = conversation.id

    await bot.direct.send(convId, 'Hey! I got your message.');
});
```

The conversation ID is what ties your reply to the right conversation.
Always use `conversation.id` from the event itself rather than
constructing one yourself.

## A complete example

Here is a Direct handler that responds to commands sent through DMs,
including a greeting that handles the null username gracefully:

```javascript
bot.on('Direct', async (user, message, conversation) => {
    const cmd = message.command();
    const convId = conversation.id;

    // !ping works in DMs too
    if (cmd === '!ping') {
        await bot.direct.send(convId, 'Pong! 🏓');
        return;
    }

    // !gold — show the bot's wallet balance privately
    if (cmd === '!gold') {
        const wallet = await bot.inventory.wallet.get();

        if (!wallet.ok) {
            await bot.direct.send(convId, 'Could not fetch the wallet right now.');
            return;
        }

        await bot.direct.send(convId, `I have ${wallet.gold} gold.`);
        return;
    }
});
```

## Summary

* The `Direct` event fires on any private message sent to the bot.
* Use `bot.direct.send(conversation.id, text)` to reply.
* `message.command()` and `message.args()` work exactly like they do in room chat.
* `user.username` is always `null`; use the `user.id` to identify the sender.