# Events

Events are how Highrise talks to your bot. Every time something happens
in the room, a message, a join, a tip, a movement, Highrise sends your
bot a notification. That notification is an event. Your job is to listen
for the events you care about and tell the bot what to do when they fire.

## How events work

When something happens in your room, the Highrise server sends a message
to your bot over the WebSocket connection. The SDK receives that message,
figures out what type of event it is, wraps the data in a clean object,
and calls your listener function with that data.

You never touch the raw WebSocket message. By the time the event reaches
your code, it has already been parsed, validated, and turned into
something readable.

## Listening to events

You listen to events using `bot.on()`:

```javascript
bot.on('Chat', async (user, message) => {
    console.log(`${user.username} said: ${message.content}`);
});
```

The first argument is the event name. The second is a function that
runs when it fires. The parameters inside that function are the data the
event gives you to work with. Different events give you different data.

## on vs once

You have two ways to listen to an event.

`bot.on()` listens forever. Every time the event fires, your function
runs. Use this for events you want to respond to continuously.

```javascript
bot.on('Chat', async (user, message) => {
    // runs every single time someone sends a message
});
```

`bot.once()` listens one time only. After the event fires once, the
listener removes itself automatically.

```javascript
bot.once('Ready', async (metadata) => {
    // runs once when the bot first connects, then never again
});
```

You will use `bot.on()` for almost everything. The main place you use
`bot.once()` is the `Ready` event, because your bot reconnects
automatically when the connection drops and you usually do not want your
setup code running every time that happens.

## Multiple listeners on the same event

You can have as many listeners as you want on the same event. They all
run when it fires.

```javascript
bot.on('Chat', async (user, message) => {
    // handles commands
    if (message.command() === '!ping') {
        await bot.message.send('Pong!');
    }
});

bot.on('Chat', async (user, message) => {
    // logs every message separately
    log.debug('Chat', `${user.username}: ${message.content}`);
});
```

Both of these will run every time someone sends a message. This is
useful when you want to keep different pieces of logic separate from
each other. Just be aware that they run in the order they were
registered.

## async and await

Every event handler has `async` in front of it:

```javascript
bot.on('Chat', async (user, message) => {
    await bot.message.send('Hello!');
});
```

This is because sending messages, fetching room data, and most things
your bot does take a small amount of time. They are asynchronous,
meaning they do not finish instantly.

The `async` keyword lets you use `await` inside the function. The
`await` keyword tells JavaScript to wait for that operation to finish
before moving on to the next line.

If you forget `await`, your code keeps running before the operation
finishes and you might get unexpected behavior. As a rule of thumb, any
time you call something on `bot` that fetches or sends data, put `await`
in front of it.

## The full list of events

Here is every event your bot can listen to:

| Event | When it fires |
|---|---|
| `Ready` | Bot connects to the room |
| `Chat` | Someone sends a room message |
| `Whisper` | Someone sends a whisper to the bot |
| `UserJoined` | Someone enters the room |
| `UserLeft` | Someone leaves the room |
| `Movement` | Someone moves or sits |
| `Tip` | Someone tips in the room |
| `Moderation` | A moderation action happens |
| `Voice` | Voice chat status changes |
| `Direct` | A direct message is received |
| `Channel` | A hidden channel message arrives |

Each one is covered in detail in the Events section. Head there when
you are ready to start using them.