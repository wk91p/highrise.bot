# bot.await

The `bot.await` API pauses execution until a specific event occurs in
the room. Each method returns a promise that resolves when a matching
event is collected or the timeout expires.

## Methods

### chat(options)

Waits for one or more chat messages in the room.

```javascript
const [user, message] = await bot.await.chat({
    filter: (user, message) => message.content.includes('hello'),
    timeout: 10000
});
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `filter` | `(user, message) => boolean` | Only collect messages that pass this check |
| `timeout` | `number` | Milliseconds before resolving early (default: `30000`) |
| `maxToCollect` | `number` | Number of events to collect before resolving (default: `1`) |
| `uniqueUsers` | `boolean` | Only collect one event per user (default: `false`) |

**Returns:** `[User, Message]` when `maxToCollect` is `1`, or `[User, Message][]` when collecting multiple.

### direct(options)

Waits for one or more direct messages sent outside of a room.

```javascript
const [user, message, conversation] = await bot.await.direct({
    filter: (user) => user.id === '123'
});
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `filter` | `(user, message, conversation) => boolean` | Only collect messages that pass this check |
| `timeout` | `number` | Milliseconds before resolving early (default: `30000`) |
| `maxToCollect` | `number` | Number of events to collect before resolving (default: `1`) |
| `uniqueUsers` | `boolean` | Only collect one event per user (default: `false`) |

**Returns:** `[User, Message, Conversation]` when `maxToCollect` is `1`, or `[User, Message, Conversation][]` when collecting multiple.

### tip(options)

Waits for one or more tip events between players in the room.

```javascript
const [sender, receiver, currency] = await bot.await.tip({
    filter: (sender, receiver) => receiver.id === bot.metadata.userId
});
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `filter` | `(sender, receiver, currency) => boolean` | Only collect tips that pass this check |
| `timeout` | `number` | Milliseconds before resolving early (default: `30000`) |
| `maxToCollect` | `number` | Number of events to collect before resolving (default: `1`) |
| `uniqueUsers` | `boolean` | Only collect one event per sender (default: `false`) |

**Returns:** `[Sender, Receiver, Currency]` when `maxToCollect` is `1`, or `[Sender, Receiver, Currency][]` when collecting multiple.

### movement(options)

Waits for one or more movement events in the room.

```javascript
const [user, position] = await bot.await.movement({
    filter: (user) => user.id === '123'
});
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `filter` | `(user, position, anchor) => boolean` | Only collect movements that pass this check |
| `timeout` | `number` | Milliseconds before resolving early (default: `30000`) |
| `maxToCollect` | `number` | Number of events to collect before resolving (default: `1`) |
| `uniqueUsers` | `boolean` | Only collect one event per user (default: `false`) |

**Returns:** `[User, Position | null, AnchorPosition | null]` when `maxToCollect` is `1`, or an array of those tuples when collecting multiple. Both `position` and `anchor` may be `null` if the user is in a transitional state.

## Complete example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!guess') {
        await bot.message.send('Guess a number between 1 and 10!');

        const answer = Math.floor(Math.random() * 10) + 1;

        const result = await bot.await.chat({
            filter: (user, message) => user.id === user.id && !isNaN(Number(message.content)),
            timeout: 15000
        });

        if (!result.length) {
            await bot.message.send('Time is up!');
            return;
        }

        const [user, reply] = result; // replay is `message` but we named it like that
        const guess = Number(reply.content);

        if (guess === answer) {
            await bot.message.send(`Correct! The answer was ${answer}.`);
        } else {
            await bot.message.send(`Wrong! The answer was ${answer}.`);
        }
    }

    if (cmd === '!collect') {
        await bot.message.send('Collecting the next 3 messages...');

        const messages = await bot.await.chat({
            maxToCollect: 3,
            timeout: 20000,
            uniqueUsers: true
        });

        await bot.message.send(`Collected ${messages.length} message(s).`);
    }
});
```

## How resolving works

All awaiter methods follow the same resolution rules:

- Resolves with a single tuple when `maxToCollect` is `1`.
- Resolves with an array of tuples when `maxToCollect` is greater than `1`.
- Resolves with whatever was collected so far if the timeout expires before `maxToCollect` is reached.
- Resolves with an empty array `[]` if the timeout expires before any events are collected.

## Important things to know

**Always handle the empty array case.** If the timeout expires with nothing collected, the promise resolves with `[]`. Destructuring directly without checking will give you `undefined` values.

```javascript
const result = await bot.await.chat({ timeout: 5000 });
if (!result.length) return; // timed out with no messages
const [user, message] = result;
```

**`filter` errors are silently ignored.** If your filter function throws, the event is skipped and the awaiter continues waiting.

**`uniqueUsers` is per-awaiter.** It only tracks users within that single `await` call, not across your entire bot.

**Awaiters run in parallel with your event handlers.** Incoming events are passed to both `bot.on` listeners and any active awaiters at the same time.