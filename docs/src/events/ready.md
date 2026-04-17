# Ready Event

The Ready event is the very first event your bot receives after it
successfully connects to a Highrise room. Think of it as the bot waking
up and saying "I am here, I am connected, what should I do?" Everything
else in your bot depends on this moment happening first.

Before the Ready event fires, your bot has no active connection to
Highrise. After it fires, your bot is fully online and can send
messages, listen to other events, and interact with users.

## Event structure

```javascript
bot.once('Ready', async (metadata) => {

});
```

Notice we use `bot.once` here and not `bot.on`. This is one of the most
important things to understand about the Ready event.

Your bot reconnects automatically whenever the connection drops, which
means the Ready event fires again every single time that happens. If you
use `bot.on`, everything inside that handler runs again on every
reconnect. If you use `bot.once`, it runs only the very first time the
bot connects.

Ask yourself: do I want this code to run every time the bot reconnects,
or just once when it first comes online? For most setup code the answer
is once, which is why `bot.once` is almost always the right choice here.

## The metadata object

The Ready event gives you a `metadata` object containing information
about your bot and the room it connected to. Here is everything inside
it:

```javascript
bot.once('Ready', async (metadata) => {
    metadata.bot_id          // the bot's own user ID
    metadata.room.room_name  // the display name of the room
    metadata.room.owner_id   // the user ID of whoever owns the room
    
    // other property you rarely touch
    metadata.connection.id // unique current connection id
    metadata.connection.rate_limits // rate limit instruction
});
```

You can also access this same object at any time through the getter on
the bot after Ready has fired:

```javascript
// available anywhere in your code after Ready fires
bot.metadata.bot_id
bot.metadata.room.room_name
bot.metadata.room.owner_id
```

This is useful when you need the bot's ID or room name inside another
event handler and do not want to store them in a variable yourself.

The three most commonly used properties are:

`metadata.bot_id` — the bot's own user ID. Useful when you need to know
whether a tip was sent to the bot specifically, or for anything that
needs to reference the bot as a user.

`metadata.room.room_name` — the display name of the room the bot
connected to. Great for logging so you always know which room is which
in your terminal.

`metadata.room.owner_id` — the user ID of the person who owns the room.
Useful if you want to automatically give the room owner special
permissions without hardcoding their ID.

## A complete example

Here is a Ready handler that covers everything you would typically want
to do when your bot first comes online, with every line explained:

```javascript
bot.once('Ready', async (metadata) => {
    // log that the bot is online and which room it is in
    // this is the first thing you will see in your terminal every time you start the bot
    log.info('Bot', `Online in ${metadata.room.room_name}`);

    // log the bot's own user ID
    // you might need this later when checking if a tip was sent to the bot
    log.info('Bot', `Bot ID: ${metadata.bot_id}`);

    // send a connect message to the room
    // this only runs once because we used bot.once, not bot.on
    // so it will not spam "Bot is online!" every time the connection drops and recovers
    const result = await bot.message.send('Bot is online!');

    if (!result.ok) {
        log.warn('Bot', `Could not send connect message: ${result.error}`);
    }

    // move the bot to a specific position in the room on startup
    // useful if you want the bot to always stand in the same place
    await bot.player.walk(5, 0, 3, 'FrontRight');
});
```

> [!NOTE]
> We’re using the `Logger` we covered in the Fundamentals chapter to keep our terminal clean.

## What to put here

- The Ready event is for setup code that should run once when the bot
- comes online. Good things to put here are:

- Logging that the bot is online with its room name and bot ID.

- Sending a connect message to the room if you want one.

- Moving the bot to a starting position using `bot.player.walk(x, y, z, facing)`.

- Fetching initial data you need before the bot starts responding to
users.

- Starting `setInterval` or `setTimeout` (remember to store their id for cleanup)

## What not to put here

Command handling, tip responses, welcome messages, and anything else
that needs to respond to ongoing events all belong in their own event
handlers like `Chat`, `Tip`, and `UserJoined`. Putting those things
inside Ready would mean they only run once when the bot connects and
never again.

Also avoid making many API requests all at once right after connecting.
The bot just established its connection and things are still settling.
If you need room data, it is better to wait until a user action
triggers the fetch or use `setTimeout` rather than doing it immediately in Ready.

## The reconnect behavior

When the connection drops, your bot reconnects automatically using
exponential backoff. Each attempt waits a little longer than the
previous one so it does not hammer the server:

```
1st attempt    ~5 seconds
2nd attempt    ~10 seconds
3rd attempt    ~20 seconds
4th attempt    ~40 seconds
5th attempt    ~60 seconds  (this is the maximum)
```

When the reconnect succeeds, the Ready event fires again. Here is what
that looks like in your terminal:

```
[Highrise] │ 14:23:00 │ [INFO] │ Connected to Highrise Bot Server 
[MyBot] │ 14:23:01 │ [INFO] │ Bot │ Online in My Room
[MyBot] │ 14:35:17 │ [WARN] │ Closing... │ code: 1006 · reason: null · connection Id: c5a6fc01-64a6-4dfa-8520-6c36ca977a01
[MyBot] │ 14:35:21 │ [INFO] │ Reconnecting... │ 5.3 seconds delay

[Highrise] │ 14:35:27 │ [INFO] │ Connected to Highrise Bot Server 
```

Because we used `bot.once`, our handler does not run again on the
second connect. The bot is back online and everything works normally
without sending another "Bot is online!" message to the room.

The reconnect counter resets to zero every time a successful connection
is made, so a bot that stays connected will always start from a short
wait if it ever does drop.

## Fatal errors

Some errors stop the reconnect loop entirely because retrying would
never help. If your token is invalid or the room does not exist, the
bot stops and logs why:

```
[Highrise] │ 11:59:59 │ [WARN] │ Websocket │ API token not found
[Highrise] │ 12:00:00 │ [ERROR] │ Connection │ Server requested no reconnect, stopping
```

When you see this, the cause is always one of these three things:

Your bot token is wrong or was deleted from the developer portal.

Your room ID is incorrect or the room no longer exists.

The room ID format is invalid.

Fix the credentials in your `.env` file and restart the bot. The Ready
event will fire normally once the connection succeeds.

## Summary

- Use `bot.once` for setup code that should only execute during the bot's initial connection
- Use `bot.on` only for tasks that must repeat every time the bot reconnects
- The `metadata` object provides the bot ID, room name, and room owner ID
- Access room and bot details globally at any time using `bot.metadata`
- The Ready event is the ideal place for logging, connection messages, and initial positioning
- Keep command handling and user interactions in their respective event handlers
