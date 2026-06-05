# bot.looper

The `bot.looper` API allows you to loop emotes for users in the room. It automatically repeats an emote after its duration ends, until explicitly stopped or an error occurs.

> [!NOTE]
> Only one emote loop can be active per user at a time. Starting a new loop for a user will automatically stop their current one.

## Methods

### start(user, identifier)

Starts a looping emote for a user. The `identifier` can be the emote's name, ID, or index number.

> [!NOTE]
> Passing index as a string will be serialized to number internally by warping it using `Number()`

```javascript
const emote = await bot.looper.start(user, "Rest");

if (emote) {
    console.log(`Looping ${emote.name} for ${user.username}`);
}
```

```javascript
// by ID
await bot.looper.start(user, "sit-idle-cute");

// by index
await bot.looper.start(user, "1");
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `user` | `User` | The user to loop the emote for |
| `identifier` | `string` | Emote name, ID, or index (e.g. `"Rest"`, `"sit-idle-cute"`, `"1"`) |

**Returns:** [`Emote`](#emote) or `null`

> [!NOTE]
> Returns `null` if the emote was not found or if the user is already looping the same emote.

### stop(userId)

Stops the active emote loop for a user.

```javascript
const emote = bot.looper.stop(user.id);

if (emote) {
    console.log(`Stopped looping ${emote.name}`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The user's unique ID |

**Returns:** [`Emote`](#emote) or `undefined` if no loop was active

### destroy()

Stops all active emote loops and clears all internal state. Called automatically on logout.

```javascript
bot.looper.destroy();
```

**Returns:** `void`

## Complete example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!loop') {
        const identifier = message.args(0);

        if (!identifier) {
            await bot.message.send('Usage: !loop <emote name, id, or index>');
            return;
        }

        const emote = await bot.looper.start(user, identifier);

        if (!emote) {
            await bot.message.send(`Could not start loop. Emote not found or already looping.`);
            return;
        }

        await bot.message.send(`Looping ${emote.name} for you!`);
        return;
    }

    if (cmd === '!stoplooop') {
        const emote = bot.looper.stop(user.id);

        if (!emote) {
            await bot.message.send(`You don't have an active emote loop.`);
            return;
        }

        await bot.message.send(`Stopped looping ${emote.name}.`);
        return;
    }
});
```

## Emote

```typescript
{
    id: string;        // unique emote identifier (e.g. "sit-idle-cute")
    name: string;      // display name (e.g. "Rest")
    duration: number;  // emote duration in seconds (e.g. 17.06)
}
```

## Important things to know

**The loop stops automatically on error.** If the emote API returns an error mid-loop, the loop is cleaned up and will not retry.

**Starting a new emote stops the current one.** If a user is already looping an emote and you call `start` with a different emote, the current loop is stopped first.

**Index is 1-based in `start`.** Unlike `bot.utils.emotes.getByIndex` which is zero-based, passing an index string to `start` is 1-based (e.g. `"1"` returns the first emote).