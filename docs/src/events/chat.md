# Chat Event

The Chat event fires every time someone
sends a message in the room and it is where almost all of your bot's
commands and responses will live. If you want your bot to react when
someone types something, this is the event you need.

## Event structure

```javascript
bot.on('Chat', async (user, message) => {

});
```

We use `bot.on` here instead of `bot.once` because we want this to run
every single time someone sends a message, not just once. Every message,
every user, every time.

## The user object

The `user` object tells you who sent the message. It has two properties:

```javascript
bot.on('Chat', async (user, message) => {
    console.log(user.id);        // their unique Highrise user ID
    console.log(user.username);  // their display name
});
```

The `id` is a unique string that permanently identifies that user across
all of Highrise. The `username` is their display name which can change
over time. If you are storing information about users, always store
their `id` and use `username` only for displaying to people. A user's
name might be different next week but their ID will always be the same.

## The message object

The `message` object is more than just the text they sent. It has
methods built into it that make working with commands feel natural. We
covered the message object in detail in the
[Message Object](../concepts/message-object.md) chapter, but here is a
quick reminder of what it gives you:

```javascript
bot.on('Chat', async (user, message) => {
    message.content      // the full message text, trimmed of whitespace
    message.command()    // the first word — "!ping hello" → "!ping"
    message.args()       // everything after — "!ping hello world" → ["hello", "world"]
    message.args(0)      // first argument — "yahya"
    message.mentions()   // any @mentions — ["Unfairly"]
    message.mentions(0)  // first mention — "Unfairly"
});
```

## Bot messages are filtered automatically

You do not need to check whether the message came from the bot itself.
The SDK filters out the bot's own messages before the Chat event ever
fires. If your bot sends "Hello everyone!" in the room, that will not
trigger your Chat handler. This is handled for you so you never have to
write `if (user.id === botId) return`.

## Building your first command

Here is the most straightforward way to respond to a command:

```javascript
bot.on('Chat', async (user, message) => {
    if (message.command() === '!ping') {
        await bot.message.send('Pong! 🏓');
        return;
    }
});
```

The `return` after sending the reply is important. It tells JavaScript
to stop running the rest of the handler after this command matches.
Without it the code keeps going and checks every other condition even
though a command already matched. As your list of commands grows this
becomes more and more significant.

## A complete example

Let's build something realistic. Here is a Chat handler with several
commands that cover the most common things bots do, with every single
line explained so you know exactly what is happening and why:

```javascript
bot.on('Chat', async (user, message) => {

    // store the command once at the top so we only call message.command() once
    // then use cmd throughout instead of calling message.command() in every if statement
    const cmd = message.command();

    // !ping
    // the simplest command — just checks if the bot is alive and responding
    if (cmd === '!ping') {
        await bot.message.send('Pong! 🏓');
        return;
    }

    // !uptime
    // bot.utils.uptime() reads the connection timestamp from the bot's internal state
    // and returns a formatted string like "2h 30m 15s"
    // you do not need to track this yourself, it is built in
    if (cmd === '!uptime') {
        const uptime = bot.utils.uptime()
        await bot.message.send(`Online for ${uptime}`);
        return;
    }

    // !users
    // bot.room.users.count() is a shorthand that fetches the room users
    // and immediately returns how many there are without needing the full response
    if (cmd === '!users') {
        const count = await bot.room.users.count();
        await bot.message.send(`There are ${count} users in the room right now.`);
        return;
    }

    // !find
    // this command accepts either a plain username or an @mention
    // message.mentions(0) checks for @Unfairly style input first
    // message.args(0) falls back to a plain "Unfairly" style input if there is no mention
    // this means both "!find Unfairly" and "!find @Unfairly" work exactly the same way
    if (cmd === '!find') {
        const target = message.mentions(0) || message.args(0);

        if (!target) {
            await bot.message.send('Usage: !find <username> or !find @Unfairly');
            return;
        }

        // bot.room.users.position() accepts either a username or a user ID
        // it returns the position object if the user is in the room, or null if they are not
        const pos = await bot.room.users.position(target);

        if (!pos) {
            await bot.message.send(`${target} is not in the room.`);
            return;
        }

        // pos.x is left/right, pos.y is height, pos.z is forward/back, pos.facing is direction
        await bot.message.send(
            `${target} is at ${pos.x}, ${pos.y}, ${pos.z} facing ${pos.facing}`
        );
        return;
    }

    // !gold
    // fetches the bot's wallet from Highrise and shows the gold balance
    // always check result.ok before using the data
    // if the request failed, result.error tells you what went wrong
    if (cmd === '!gold') {
        const wallet = await bot.inventory.wallet.get();

        if (!wallet.ok) {
            await bot.message.send('Could not fetch the wallet right now, try again.');
            return;
        }

        // wallet.gold is the bot's current gold balance
        // wallet.boostToken and wallet.voiceToken are also available
        await bot.message.send(`I have ${wallet.gold} gold.`);
        return;
    }

    // !hi
    // responds to the user who sent the message by name
    // user.username is their current display name
    if (cmd === '!hi') {
        await bot.message.send(`Hey ${user.username}! 👋`);
        return;
    }

    // !room
    // bot.metadata is a getter that reads from the bot's internal state
    // it is available after the Ready event fires and gives you the room name and owner ID
    if (cmd === '!room') {
        const meta = bot.metadata;

        if (!meta) {
            await bot.message.send('Still connecting, try again in a moment.');
            return;
        }

        await bot.message.send(`This room is called ${meta.room.room_name}`);
        return;
    }

});
```

There are a few things worth noticing in this example that will make
your own bots cleaner.

We store `message.command()` in `cmd` at the very top so we call that
method only once. Every command after that uses `cmd` instead of calling
`message.command()` again inside each `if` statement.

For the `!find` command we use `message.mentions(0) || message.args(0)`
which means the user can type either `!find Unfairly` or
`!find @Unfairly` and both work exactly the same way. This makes your
bot feel much more natural to use.

We always check `wallet.ok` before trying to use `wallet.gold`. If the
request failed for any reason, `wallet.gold` would not be set and your
bot would either crash or send a confusing message. Checking first and
handling the error case is the right pattern every time.

We use `bot.metadata` rather than storing metadata in a variable during
the Ready event. Since `bot.metadata` is a getter that reads from the
bot's internal state, it is always available after Ready fires and you
do not need to manage it yourself.

## Responding to specific users

Sometimes you only want to respond to certain users. The most reliable
way to check is by user ID, not username, because IDs never change:

```javascript
const OWNER_ID = 'the_room_owners_user_id';

bot.on('Chat', async (user, message) => {
    if (message.command() === '!shutdown') {

        // check by ID, not username, because usernames can change
        if (user.id !== OWNER_ID) {
            await bot.message.send('You do not have permission to do that.');
            return;
        }

        await bot.message.send('Shutting down. Goodbye!');
        process.exit(0);
    }
});
```

If you want to use the room owner's ID without hardcoding it, you can
read it from `bot.metadata` which is populated after the Ready event:

```javascript
bot.on('Chat', async (user, message) => {
    if (message.command() === '!shutdown') {
        const ownerId = bot.metadata?.room.owner_id;

        if (user.id !== ownerId) {
            await bot.message.send('Only the room owner can do that.');
            return;
        }

        await bot.message.send('Shutting down. Goodbye!');
        process.exit(0);
    }
});
```

## Whispers vs chat messages

The Chat event only fires for public room messages. Whispers are a
separate event. If you want the same command to work in both public chat
and whispers, you need to listen to both events separately. We will
cover that in the [Whisper](./whisper.md) page.

## Summary

- The Chat event fires every time someone sends a public room message
- You get a `user` object (`id`, `username`) and a `message` object (`content`, `command()`, `args()`, `mentions()`)
- Store `message.command()` in a variable at the top of your handler to avoid multiple calls
- Always use `return` after handling a command to stop further code execution
- Use `message.mentions(0) || message.args(0)` to support both @mentions and plain text usernames
- Always check `result.ok` before using data retrieved from any API request
- The bot's own messages are automatically filtered out to prevent infinite loops
- Access room and bot information via `bot.metadata` instead of creating your own variables
