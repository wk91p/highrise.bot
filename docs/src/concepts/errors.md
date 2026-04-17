# Error Handling

Nobody writes perfect code and networks are not perfectly reliable.
Things go wrong. This page explains how highrise.bot handles errors and
what you need to do about them.

## The short version

You do not need `try/catch` blocks around your bot code. Every request
your bot makes catches its own errors and returns them to you in a
consistent, readable way. Your bot will not crash from a failed request.

## How errors come back to you

When something goes wrong, the response object tells you about it
through the same `ok` and `error` properties you already know:

```javascript
const result = await bot.message.send('Hello!');

result.ok     // false if something went wrong
result.error  // "ChatApi: message failed to send"
```

The error message always includes which part of the SDK it came from.
That prefix like `"ChatApi:"` or `"GetRoomUsersResponse:"` tells you
exactly where to look without having to dig through stack traces.

## Two ways to check

```javascript
const result = await bot.message.send('Hello!');

// option 1
if (!result.ok) {
    console.log(result.error);
    return;
}

// option 2
if (result.hasError()) {
    console.log(result.error);
    return;
}
```

Both do exactly the same thing. Use whichever reads more naturally to
you. Most developers use `!result.ok` because it is shorter.

## When to check and when not to

You do not need to check every single response. Think about how
important the operation is.

For things that do not really matter if they fail occasionally, just
fire and forget:

```javascript
// not critical, skip the check
await bot.message.send(`Welcome, ${user.username}!`);
```

For things that matter, always check:

```javascript
const result = await bot.room.moderation.ban(userId, 3600);

if (!result.ok) {
    log.error('Moderation', `Failed to ban ${userId}: ${result.error}`);
    await bot.message.send('Something went wrong, the ban did not go through.');
    return;
}

await bot.message.send(`${username} has been banned.`);
```

For purchases, always check and be specific about why it failed:

```javascript
const result = await bot.inventory.item.buy(itemId);

if (result.insufficientFunds) {
    await bot.message.send('Not enough gold to buy that item.');
    return;
}

if (!result.ok) {
    await bot.message.send('Could not complete the purchase right now.');
    return;
}

await bot.message.send('Item purchased!');
```

`BuyItemResponse` and `BuyRoomBoostResponse` have two extra boolean
properties — `success` and `insufficientFunds` — because these are the
two outcomes worth handling differently. `insufficientFunds` lets you
give users a meaningful message instead of a generic error.

## Validation errors

Before a request even reaches Highrise, the SDK checks that what you
are passing makes sense. If you pass the wrong type of value or forget
a required argument, you get back an error immediately without wasting
a network request:

```javascript
const result = await bot.room.moderation.mute(userId, -5);

result.ok     // false
result.error  // "duration must be a positive number"
```

The error message tells you exactly what is wrong and which value
caused it. This is especially helpful when building commands that take
user input, because users will type unexpected things. If someone types
`!mute yahya abc`, the validation catches it and tells you `duration
must be a positive number` before it even tries to talk to Highrise.

## Connection errors and reconnection

If the connection to Highrise drops, your bot reconnects automatically.
You do not handle this yourself. The reconnect logic uses exponential
backoff, which means it waits a little longer between each attempt so
it does not spam the server:

```
1st attempt    5 seconds
2nd attempt    10 seconds
3rd attempt    20 seconds
4th attempt    40 seconds

(this is the maximum wait, will always retry after 60s from this point)
5th attempt    60 seconds 
```

While the bot is reconnecting, any requests you try to make will return
an error:

```javascript
result.ok     // false
result.error  // "Websocket is not connected"
```

Once the bot reconnects, everything goes back to normal on its own.

## Fatal errors

Some errors mean the bot cannot connect at all and retrying would not
help. If your token is invalid or the room does not exist, the bot stops
trying to reconnect and logs the reason:

```
[MyBot] │ 12:00:00 │ [ERROR] │ Connection │ Server requested no reconnect, stopping
```

The three fatal errors that trigger this are:

- `API token not found` — your token is wrong or was deleted
- `Room not found` — the room ID is incorrect or the room was deleted
- `Invalid room id` — the room ID format is wrong

When you see this, fix your `.env` file and restart the bot. No amount
of retrying will fix a bad token.

## A complete example

Here is a command handler that covers the full error handling flow from
validation to response checking:

```javascript
bot.on('Chat', async (user, message) => {
    if (message.command() === '!tip') {
        // get the target from a mention or plain username
        const target = message.mentions(0) || message.args(0);

        if (!target) {
            await bot.message.send('Usage: !tip @username <amount>');
            return;
        }

        // validate the amount argument
        const amount = Number(message.args(1) || message.args(0));
        if (isNaN(amount) || amount <= 0) {
            await bot.message.send('Please provide a valid gold amount.');
            return;
        }

        // find the user in the room
        const found = await bot.room.users.find(target);
        if (!found) {
            await bot.message.send(`${target} is not in the room.`);
            return;
        }

        // attempt the tip
        const result = await bot.player.tip(found.user.id, amount);

        if (!result.ok) {
            log.error('Tip', result.error);
            await bot.message.send('Could not send the tip right now.');
            return;
        }

        await bot.message.send(`Tipped ${target} ${amount} gold!`);
    }
});
```

Each step checks what it needs to and gives the user a clear message
about what went wrong. Nothing crashes. The bot keeps running. That is
the pattern you want everywhere in your bot.