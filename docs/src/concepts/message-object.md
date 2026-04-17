# The Message Object

The `message` object appears in the `Chat`, `Whisper`, and `Direct`
events. It is more than just a container for text. It has built-in
methods that make working with commands and user input feel natural.
Understanding it well will make everything else in your bot easier.

## The content property

`message.content` is the full, trimmed text of what the user sent:

```javascript
bot.on('Chat', async (user, message) => {
    console.log(message.content);
    // user typed "!ping hello world"
    // message.content is "!ping hello world"
});
```

The content is always trimmed of leading and trailing whitespace. You
never have to call `.trim()` yourself.

## message.command()

`message.command()` returns the first word of the message. This is how
you detect commands:

```javascript
bot.on('Chat', async (user, message) => {
    console.log(message.command());
    // "!ping hello world"  →  "!ping"
    // "hello everyone"     →  "hello"
    // "!help"              →  "!help"
    // ""                   →  null
});
```

If the message is empty, `message.command()` returns `null`. It will
never crash.

## message.args()

`message.args()` returns everything after the first word. You can call
it with no arguments to get the full array, or pass a number to get a
specific argument at that position:

```javascript
bot.on('Chat', async (user, message) => {
    // user typed: "!kick @Unfairly spamming"

    message.args()     // ["@Unfairly", "spamming"]
    message.args(0)    // "@Unfairly"   — first argument
    message.args(1)    // "spamming" — second argument
    message.args(5)    // null      — does not exist, never crashes
});
```

If there are no arguments, `message.args()` returns an empty array `[]`
and `message.args(0)` returns `null`. You can always safely access any
index without worrying about it crashing.

## message.mentions()

`message.mentions()` returns any words in the message that start with
`@`. The `@` symbol is stripped from the returned value so you get the
username directly. Just like `args()`, you can call it without an
argument to get all mentions, or pass a number to get a specific one:

```javascript
bot.on('Chat', async (user, message) => {
    // user typed: "!tip @Unfairly nice one"

    message.mentions()   // ["Unfairly"]
    message.mentions(0)  // "Unfairly"

    // user typed: "!game @Unfairly vs @WSA0"
    message.mentions()   // ["Unfairly", "WSA0"]
    message.mentions(0)  // "Unfairly"
    message.mentions(1)  // "WSA0"

    // user typed: "hello everyone"
    message.mentions()   // []
    message.mentions(0)  // null
});
```

## Combining args and mentions

A common pattern is accepting input as either a plain username or an
@mention and letting the user use whichever they prefer:

```javascript
bot.on('Chat', async (user, message) => {
    if (message.command() === '!find') {
        // accept "!find Unfairly" or "!find @Unfairly"
        const target = message.mentions(0) || message.args(0);

        if (!target) {
            await bot.message.send('Usage: !find <username> or !find @username');
            return;
        }

        const pos = await bot.room.users.position(target);
        if (!pos) {
            await bot.message.send(`${target} is not in the room.`);
            return;
        }

        await bot.message.send(
            `${target} is at ${pos.x}, ${pos.y}, ${pos.z}`
        );
    }
});
```

`message.mentions(0) || message.args(0)` checks for a mention first and
falls back to a plain username if there is no mention. Both `!find Unfairly`
and `!find @Unfairly` work exactly the same way. Small touches like this
make your bot feel much more natural to use.

## Practical example

Here is a realistic Chat handler showing how to use all three methods
together effectively:

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    // store command once at the top, use it throughout
    // this is cleaner than calling message.command() in every if statement

    if (cmd === '!ping') {
        await bot.message.send('Pong! 🏓');
        return;
    }

    // command with a plain argument
    if (cmd === '!say') {
        const text = message.args().join(' ');
        if (!text) {
            await bot.message.send('Usage: !say <text>');
            return;
        }
        await bot.message.send(text);
        return;
    }

    // command with a mention or username
    if (cmd === '!info') {
        const target = message.mentions(0) || message.args(0);
        if (!target) {
            await bot.message.send('Usage: !info @username');
            return;
        }

        const found = await bot.room.users.find(target);
        if (!found) {
            await bot.message.send(`${target} is not in the room.`);
            return;
        }

        await bot.message.send(`${found.user.username} is at ${found.position.x}, ${found.position.z}`);
        return;
    }

    // command with multiple arguments
    if (cmd === '!add') {
        const a = Number(message.args(0));
        const b = Number(message.args(1));

        if (isNaN(a) || isNaN(b)) {
            await bot.message.send('Usage: !add <number> <number>');
            return;
        }

        await bot.message.send(`${a} + ${b} = ${a + b}`);
        return;
    }
});
```

Notice how storing `message.command()` in `cmd` at the top makes the
code cleaner. You call it once and use the result everywhere instead of
calling `message.command()` inside every single `if` statement.

## The message object in Direct events

The `Direct` event also gives you a `message` object. It works the same
way, but `message.content` will be the content of the direct message
the user sent. The same `command()`, `args()`, and `mentions()` methods
are available so you can build command systems for direct messages too.