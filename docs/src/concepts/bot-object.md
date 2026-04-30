# The Bot Object

When you write `const bot = new Highrise()`, you are creating the heart
of your entire bot. Everything goes through this one object. This page
explains what it is, what lives on it, and how it all fits together.

## What bot actually is

`bot` is an instance of the `Highrise` class which is built on top of
Node.js's `EventEmitter`. That means two things: it can listen to events
with `bot.on()` and `bot.once()`, and it can emit events internally when
things happen on the WebSocket connection.

When you call `bot.login(token, roomId)`, the bot creates a WebSocket
connection to Highrise, sets up all of its internal handlers, and starts
listening. You never have to touch the WebSocket directly.

## What lives on bot

After you call `bot.login()`, these properties are available on `bot`:

```javascript
bot.message    // send room messages and whispers
bot.whisper    // send private whispers to users
bot.channel    // send hidden channel messages
bot.direct     // direct messages, conversations
bot.room       // room users, moderation, voice, privilege
bot.player     // actions, emotes, tips, teleport, outfit
bot.inventory  // wallet, outfit, items, boosts
bot.utils      // sleep, uptime, splitMessages and more
```

Each one is a domain. `bot.room` knows everything about the room.
`bot.player` knows everything about interacting with players.
`bot.inventory` knows everything about items and currency in bot. You will
never need to go looking for something in the wrong place.

## The three getters

The bot also has three read-only properties you can access at any time:

### bot.metadata

This gives you information about the bot and the room it connected to.
It is only available after the `Ready` event fires.

```javascript
bot.metadata.botId             // the bot's own user ID
bot.metadata.room.roomName     // the display name of the room
bot.metadata.room.ownerId      // the user ID of the room owner
```

You will use `bot.metadata` often. Checking `bot.metadata.botId` lets
you know the bot's own identity. Checking `bot.metadata.room.ownerId`
lets you give special permissions to the room owner automatically.

### bot.credential

This gives you the token and room ID that were used to log in.

```javascript
bot.credential.token   // the bot token
bot.credential.roomId  // the room ID
```

You rarely need this directly. The SDK uses it internally when
reconnecting after a dropped connection.

### bot.connectTime

This is the timestamp in milliseconds of when the bot last successfully
connected. It resets every time the bot reconnects.

```javascript
bot.connectTime  // e.g. 1710000000000
```

You can use this to calculate uptime yourself, but `bot.utils.uptime()`
already does that for you and returns a clean string like `2h 30m 15s`.

## Listening to events

You attach behavior to your bot by listening to events:

```javascript
// runs every time
bot.on('Chat', async (user, message) => { });

// runs only once
bot.once('Ready', async (metadata) => { });

// remove a listener
bot.off('Chat', someFunction);
```

The difference between `on` and `once` is important. `on` listens
forever, every time the event fires, your function runs. `once` listens
one time only and then removes itself automatically. You will almost
always use `on` except for the `Ready` event where `once` is the correct
choice because `Ready` fires again on every reconnect.

## The login method

```javascript
bot.login(token, roomId)
```

This is always the last line in your file. It starts the WebSocket
connection and triggers everything else. If you call it before
registering your event listeners, the bot might connect before your
code is ready to handle anything.

The reason `bot.login()` is always at the bottom is simple: JavaScript
reads your file from top to bottom. All your `bot.on()` and `bot.once()`
calls need to be registered before the connection starts, otherwise the
first few events might fire before your handlers exist to catch them.

## A clean bot file structure

Here is the order that every bot file should follow:

```javascript
// 1. imports
const { Highrise, Logger } = require('highrise.bot');
require('dotenv').config();

// 2. setup
const log = new Logger("MyBot");
const bot = new Highrise();

// 3. event listeners (as many as you need)
bot.once('Ready', async (metadata) => { });
bot.on('Chat', async (user, message) => { });
bot.on('UserJoined', async (user, position) => { });
bot.on('Tip', async (sender, receiver, currency) => { });

// 4. login, always last
bot.login(process.env.BOT_TOKEN, process.env.ROOM_ID);
```

Follow this structure every time and your bot will work correctly. Move
`bot.login()` above your event listeners and you might miss the first
few events. Keep it at the bottom and everything works as expected.

## What the bot does automatically

Before we move on, it is worth knowing what the bot handles for you so
you do not have to think about it:

The connection reconnects automatically when it drops. You do not need
to write any reconnect logic.

Keepalive messages are sent to Highrise every 15 seconds automatically.
You never need to worry about the connection going stale.

Your bot's own messages are filtered out of the Chat event. If your bot
sends "Hello everyone!" in the room, that will not trigger your Chat
handler.

Fatal errors like an invalid token or a room that does not exist stop
the reconnect loop automatically. The bot will not keep retrying forever
on something that will never succeed.

All of this happens behind the scenes so you can focus on building what
your bot actually does.