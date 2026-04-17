# Quick Start

Your bot is installed and your credentials are set up. Now let's write
something that actually does something. By the end of this page you will
have a working bot running in your room.

## Open your bot file

If you used `npx highrise-init`, open the `index.js` that was created
for you. It already has code in it with comments explaining everything.

If you set things up manually, open your `index.js` file.

Either way, replace everything in it with this:

```javascript
const { Highrise, Logger } = require('highrise.bot');
require('dotenv').config();

const log = new Logger({ prefix: "MyBot" });
const bot = new Highrise();

bot.once('Ready', async (metadata) => {
    log.info('Bot', `Online in ${metadata.room.room_name}`);
    await bot.message.send('Hello everyone!');
});

bot.on('Chat', async (user, message) => {
    if (message.command() === '!ping') {
        await bot.message.send('Pong! 🏓');
        return;
    }
});

bot.on('UserJoined', async (user, position) => {
    await bot.message.send(`Welcome, ${user.username}!`);
});

bot.login(process.env.BOT_TOKEN, process.env.ROOM_ID);
```

## Run it

```bash
npm start
```

Go to your Highrise room. Your bot should be online. Try typing `!ping`
in the chat and watch it respond. When someone joins the room, the bot
will welcome them by name.

## What just happened

Let's go through it piece by piece so you understand what every part
does.

### Importing the SDK

```javascript
const { Highrise, Logger } = require('highrise.bot');
require('dotenv').config();
```

The first line imports two things from the SDK: `Highrise` which is the
bot itself, and `Logger` which gives you colored, timestamped output in
your terminal. The second line loads your `.env` file so `process.env`
can read your credentials.

### Creating the bot and logger

```javascript
const log = new Logger({ prefix: "MyBot" });
const bot = new Highrise();
```

`new Logger({ prefix: "MyBot" })` creates a logger that will show
`[MyBot]` at the start of every line in your terminal. Change
`"MyBot"` to whatever you want.

`new Highrise()` creates your bot. Everything you do goes through this
one object. Sending messages, listening to events, managing users, all
of it lives on `bot`.

### The Ready event

```javascript
bot.once('Ready', async (metadata) => {
    log.info('Bot', `Online in ${metadata.room.room_name}`);
    await bot.message.send('Hello everyone!');
});
```

This fires when your bot successfully connects to the room. We use
`once` instead of `on` here because your bot reconnects automatically
whenever the connection drops, and you probably do not want it saying
"Hello everyone!" every single time that happens. With `once` it only
runs the very first time.

The `metadata` object tells you things about the bot and the room.
`metadata.room.room_name` is the display name of the room. We will
cover everything inside `metadata` in the Ready event page.

### The Chat event

```javascript
bot.on('Chat', async (user, message) => {
    if (message.command() === '!ping') {
        await bot.message.send('Pong! 🏓');
        return;
    }
});
```

This fires every time someone sends a message in the room. You get the
`user` who sent it and the `message` they sent.

`message.command()` returns the first word of the message. So if someone
types `!ping hello world`, `message.command()` returns `"!ping"`.

The `return` after sending the reply is important. It tells the code to
stop running after this command matches. Without it the code keeps
checking every other condition even though a command already matched.

### The UserJoined event

```javascript
bot.on('UserJoined', async (user, position) => {
    await bot.message.send(`Welcome, ${user.username}!`);
});
```

This fires every time someone enters the room. `user.username` is their
display name.

### Connecting

```javascript
bot.login(process.env.BOT_TOKEN, process.env.ROOM_ID);
```

This is always the last line. It reads your credentials from the `.env`
file and starts the connection. Everything above it registers what the
bot should do when things happen. This line is what actually turns it on.

## Something went wrong?

If your bot connected but is not responding to `!ping`, make sure you
are typing it exactly with the exclamation mark and all lowercase.

If your bot is not connecting at all, go back to the
[Configuration](./configuration.md) page and double check your
credentials.

## What is next

Now that your bot is running, head to the Fundamentals section to
understand how everything fits together. Once you understand the
foundation, building any feature becomes straightforward.