# The Logger

The Logger is a simple but important tool that gives you clean, colored,
timestamped output in your terminal. Instead of raw `console.log()`
calls scattered everywhere, the Logger gives every message a consistent
format so you always know what happened, when it happened, and where it
came from.

## Creating a logger

```javascript
const { Logger } = require('highrise.bot');

const log = new Logger({ prefix: "MyBot" });
```

The `prefix` option is what shows up in square brackets at the start of
every line. Change it to whatever makes sense for your bot. If you have
a bot called BananaBot, use `"BananaBot"`. If you are running multiple
bots, give each one a different prefix so you can tell them apart in the
terminal.

## The four log levels

The Logger has four methods, one for each type of message:

### log.info()

For general information. Things that are working normally and you want
to know about:

```javascript
log.info('Bot', `Online in ${metadata.room.room_name}`);
log.info('Bot', `Running as ${metadata.bot_id}`);
```

Output looks like:
```
[MyBot] │ 12:00:01 │ [INFO] │ Bot │ Online in My Room
```

### log.warn()

For things that are not errors but worth paying attention to. Unexpected
but non-critical situations:

```javascript
log.warn('Chat', `${failed}/${total} message parts failed to send`);
log.warn('Bot', 'Could not move to starting position');
```

Output looks like:
```
[MyBot] │ 12:00:05 │ [WARN] │ Chat │ 1/3 message parts failed to send
```

### log.error()

For things that went wrong. Failed requests, unexpected states, anything
that needs attention:

```javascript
log.error('Moderation', `Failed to kick ${userId}: ${result.error}`);
log.error('Wallet', 'Could not fetch wallet balance');
```

Output looks like:
```
[MyBot] │ 12:00:10 │ [ERROR] │ Moderation │ Failed to kick user
```

### log.debug()

For detailed information useful while you are building and testing.
Debug logs also show the file and line number where they were called,
which is helpful for tracing exactly where something happened:

```javascript
log.debug('Chat', `Command received: ${message.command()}`);
log.debug('Room', `User count: ${count}`);
```

Output looks like:
```
[MyBot] │ 12:00:15 │ [DEBUG] │ Chat │ Command received: !ping
↳ /home/user/my-bot/index.js:25:9
```

The file path shown below debug messages tells you exactly which line
of code produced that log. This is very useful when you have a large
bot and need to find where something is coming from.

## The format

Every log line follows the same format:

```
[prefix] │ HH:MM:SS │ [LEVEL] │ category │ message
```

The `category` is the second argument you pass to each method. Use it
to describe which part of your bot the message is coming from. Good
categories are short and descriptive: `'Bot'`, `'Chat'`, `'Moderation'`,
`'Tip'`, `'Room'`.

## Logging multiple values

You can pass multiple values after the category and they will be joined
with a `·` separator:

```javascript
log.info('Close', `code: ${code}`, `reason: ${reason}`, `attempts: ${attempts}`);
```

Output:
```
[MyBot] │ 12:00:20 │ [INFO] │ Close │ code: 1006 · reason: null · attempts: 2
```

Objects are automatically converted to JSON strings so you can log them
directly without calling `JSON.stringify()` yourself:

```javascript
log.debug('Data', { userId: 'abc123', username: 'yahya' });
// logs the object as JSON automatically
```

## Using the logger in your bot

Here is a realistic example of how to use all four levels throughout a
bot:

```javascript
const { Highrise, Logger } = require('highrise.bot');
require('dotenv').config();

const log = new Logger({ prefix: "MyBot" });
const bot = new Highrise();

bot.once('Ready', async (metadata) => {
    // info: normal startup message
    log.info('Bot', `Online in ${metadata.room.room_name}`);
    log.info('Bot', `Bot ID: ${metadata.bot_id}`);
});

bot.on('Chat', async (user, message) => {
    // debug: useful while building, remove in production
    log.debug('Chat', `${user.username}: ${message.content}`);

    if (message.command() === '!kick') {
        const target = message.args(0);

        if (!target) {
            await bot.message.send('Usage: !kick <username>');
            return;
        }

        const found = await bot.room.users.find(target);
        if (!found) {
            await bot.message.send(`${target} is not in the room.`);
            return;
        }

        const result = await bot.room.moderation.kick(found.user.id);

        if (!result.ok) {
            // error: something went wrong
            log.error('Kick', `Failed to kick ${target}: ${result.error}`);
            await bot.message.send('Could not kick that user.');
            return;
        }

        // info: action completed successfully
        log.info('Kick', `${user.username} kicked ${target}`);
        await bot.message.send(`${target} was kicked.`);
    }
});

bot.on('UserJoined', async (user, position) => {
    log.debug('Join', `${user.username} joined the room`);
    await bot.message.send(`Welcome, ${user.username}!`);
});

bot.login(process.env.BOT_TOKEN, process.env.ROOM_ID);
```

Using the right log level for each situation makes your terminal output
much easier to read. Info tells you what is happening normally. Warn
flags things that need attention. Error marks real problems. Debug gives
you the detail you need when actively working on something.