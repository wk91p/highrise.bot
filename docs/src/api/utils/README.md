# bot.utils

The `bot.utils` API provides helper methods for common tasks like delays,
time formatting, message splitting, and gold calculations. It also
exposes the built-in validator.

## What lives on bot.utils

```javascript
bot.utils.sleep()              // pause execution for a duration
bot.utils.uptime()             // get bot uptime as formatted string
bot.utils.formatTime()         // format milliseconds to readable string
bot.utils.splitMessages()      // split long text into chunks
bot.utils.sequencingGoldBars() // break down gold into valid denominations
bot.utils.validator            // built-in validator instance
```

## Methods

### sleep(ms)

Pauses execution for the specified duration. Useful for rate limiting
or creating artificial delays between actions.

```javascript
// Basic delay
await bot.utils.sleep(1000); // Wait 1 second

// Between messages
await bot.message.send("First message");
await bot.utils.sleep(500);
await bot.message.send("Second message");

// In loops
for (let i = 0; i < 3; i++) {
    await bot.message.send(`Message ${i + 1}`);
    await bot.utils.sleep(1000);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `ms` | `number` | Delay duration in milliseconds |

**Returns:** `Promise<boolean>`

### uptime()

Returns the bot's uptime as a formatted string. The timer starts when
the WebSocket connection is established and resets upon reconnection.

```javascript
const uptime = bot.utils.uptime();
console.log(uptime); // "2h 30m 15s"
```

**Returns:** `string` — Formatted uptime or `"Offline"` if not connected

### formatTime(ms)

Converts milliseconds into a human-readable duration string.

```javascript
bot.utils.formatTime(3665000); // "1h 1m 5s"
bot.utils.formatTime(65000);   // "1m 5s"
bot.utils.formatTime(5000);    // "5s"
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `ms` | `number` | Milliseconds to format |

**Returns:** `string` — Formatted like `"2d 5h 13m 42s"`

### splitMessages(text, limit)

Splits long text into chunks of specified length, respecting word
boundaries. Useful when you need to send messages longer than the
256 character limit but want to split them manually.

```javascript
const longText = "This is a very long message...";
const chunks = bot.utils.splitMessages(longText, 200);

for (const chunk of chunks) {
    await bot.message.send(chunk);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `text` | `string` | The text to split |
| `limit` | `number` | Maximum characters per chunk |

**Returns:** `string[]` — Array of text chunks

> **Note:** `bot.message.send()` and `bot.whisper.send()` already split
> long messages automatically. Use this method only when you need custom
> splitting logic.

### sequencingGoldBars(amount)

Breaks down a gold amount into valid Highrise gold bar denominations.
The input is rounded down to the nearest whole number.

```javascript
bot.utils.sequencingGoldBars(454);    // [100, 100, 100, 100, 50]
bot.utils.sequencingGoldBars(7500);   // [5000, 1000, 1000, 500]
bot.utils.sequencingGoldBars(1234);   // [1000, 100, 100, 10, 10, 10, 1, 1, 1, 1]
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `amount` | `number` | Total gold amount (rounded down) |

**Returns:** `number[]` — Valid gold bar denominations in descending order

**Valid denominations:** 10000, 5000, 1000, 500, 100, 50, 10, 5, 1

> **Note:** `bot.player.splitTip()` uses this internally. Use this
> method when you need the breakdown without actually sending tips.

## validator

The built-in validator instance for validating user input. This is the
same validator used internally by all SDK methods.

```javascript
const { Validator } = require('highrise.bot');

// Using the bot's built-in validator
bot.utils.validator
    .required(userId, 'userId')
    .string(userId, 'userId');

// Or create your own instance
const validate = new Validator();
validate.positive(amount, 'amount');
```

For full validator documentation, see [The Validator](../concepts/validator.md).

## Complete example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!uptime') {
        const uptime = bot.utils.uptime();
        await bot.message.send(`I've been online for ${uptime}`);
        return;
    }

    if (cmd === '!countdown') {
        await bot.message.send('Starting in 3...');
        await bot.utils.sleep(1000);
        await bot.message.send('2...');
        await bot.utils.sleep(1000);
        await bot.message.send('1...');
        await bot.utils.sleep(1000);
        await bot.message.send('GO!');
        return;
    }

    if (cmd === '!breakdown') {
        const amount = Number(message.args(0));

        if (isNaN(amount) || amount <= 0) {
            await bot.message.send('Usage: !breakdown <amount>');
            return;
        }

        const bars = bot.utils.sequencingGoldBars(amount);
        await bot.message.send(`${amount} gold breaks down to: ${bars.join(' + ')}`);
        return;
    }

    if (cmd === '!format') {
        const ms = Number(message.args(0));

        if (isNaN(ms)) {
            await bot.message.send('Usage: !format <milliseconds>');
            return;
        }

        const formatted = bot.utils.formatTime(ms);
        await bot.message.send(`${ms}ms = ${formatted}`);
        return;
    }
});

// Rate-limited announcements
async function announceWinners(winners) {
    for (const winner of winners) {
        await bot.message.send(`Congratulations ${winner}!`);
        await bot.utils.sleep(2000); // Wait 2 seconds between announcements
    }
}
```

## Important things to know

**`sleep()` is non-blocking.** It only pauses the current async function.
Other events continue to process normally.

**`uptime()` resets on reconnect.** If the bot disconnects and reconnects,
the uptime counter starts over.

**`sequencingGoldBars()` rounds down.** Passing `454.9` returns the same
as `454`.

**Messages auto-split.** You rarely need `splitMessages()` since
`bot.message.send()` handles long messages automatically.

## Great ending

If you've read through all of these pages, we're done here. You now have everything you need to build bots that are solid, clean, and well-structured. You've learned how to handle events properly, validate input before acting, check responses for errors, and use every part of the API the way it was designed to be used.

You're at a great point. The foundation is there. What you build from here is up to you.

You can always come back to these pages anytime to check something. And if you get stuck or want feedback, the community is always there to help in [discord.gg/highrise](https://discord.gg/highrise) in the bot API section.

Good luck with your bot.