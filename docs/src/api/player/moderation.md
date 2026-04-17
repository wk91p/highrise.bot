# bot.player.moderation

The `bot.player.moderation` API handles all in-room moderation actions.
Kick, mute, ban, unmute, and unban users.

> [!IMPORTANT]
> The bot must be a moderator or made by room owner to use these methods. If the bot lacks
> permission, requests will fail with `ok: false`.

## Methods

### kick(userId)

Removes a user from the room. They can rejoin immediately.

```javascript
const result = await bot.player.moderation.kick(userId);

if (result.ok) {
    await bot.message.send('User has been kicked.');
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | ID of the user to kick |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

### mute(userId, duration)

Prevents a user from sending chat messages for a duration.

```javascript
// mute for 60 seconds
await bot.player.moderation.mute(userId, 60);

// mute for 1 hour
await bot.player.moderation.mute(userId, 3600);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | ID of the user to mute |
| `duration` | `number` | Duration in seconds (must be positive) |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

### unmute(userId)

Removes an active mute from a user.

```javascript
await bot.player.moderation.unmute(userId);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | ID of the user to unmute |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

### ban(userId, duration)

Bans a user from the room for a duration.

```javascript
// ban for 1 hour
await bot.player.moderation.ban(userId, 3600);

// ban for 24 hours
await bot.player.moderation.ban(userId, 86400);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | ID of the user to ban |
| `duration` | `number` | Duration in seconds (must be positive) |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

### unban(userId)

Removes an active ban from a user.

> [!NOTE]
> This requires the bot to be created by the room owner.

```javascript
await bot.player.moderation.unban(userId);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | ID of the user to unban |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

## Complete example

```javascript
const mutedUsers = new Map();

bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!kick') {
        const target = message.mentions(0) || message.args(0);

        if (!target) {
            await bot.message.send('Usage: !kick @username');
            return;
        }

        const found = await bot.room.users.find(target);

        if (!found) {
            await bot.message.send(`${target} is not in the room.`);
            return;
        }

        const result = await bot.player.moderation.kick(found.user.id);

        if (!result.ok) {
            await bot.message.send(`Could not kick ${target}: ${result.error}`);
            return;
        }

        await bot.message.send(`${target} has been kicked.`);
        return;
    }

    if (cmd === '!mute') {
        const target = message.mentions(0) || message.args(0);
        const duration = Number(message.args(1)) || 60;

        if (!target) {
            await bot.message.send('Usage: !mute @username [seconds]');
            return;
        }

        const found = await bot.room.users.find(target);

        if (!found) {
            await bot.message.send(`${target} is not in the room.`);
            return;
        }

        const result = await bot.player.moderation.mute(found.user.id, duration);

        if (!result.ok) {
            await bot.message.send(`Could not mute ${target}: ${result.error}`);
            return;
        }

        await bot.message.send(`${target} has been muted for ${duration} seconds.`);
        return;
    }

    if (cmd === '!unmute') {
        const target = message.mentions(0) || message.args(0);

        if (!target) {
            await bot.message.send('Usage: !unmute @username');
            return;
        }

        const found = await bot.room.users.find(target);

        if (!found) {
            await bot.message.send(`${target} is not in the room.`);
            return;
        }

        const result = await bot.player.moderation.unmute(found.user.id);

        if (!result.ok) {
            await bot.message.send(`Could not unmute ${target}: ${result.error}`);
            return;
        }

        await bot.message.send(`${target} has been unmuted.`);
        return;
    }
});

// Log all moderation actions
bot.on('Moderation', (moderator, target, action) => {
    console.log(`${moderator.id} performed ${action.type} on ${target.id}`);
});
```

## AcknowledgmentResponse

```typescript
{
    ok: boolean;           // true if the action succeeded
    error: string | null;  // error message if failed
    hasError(): boolean;
}
```

## Important things to know

**Your bot must be a moderator or made by room owner.** If the bot is not a moderator, all
methods will return `ok: false` with an error explaining the lack of
permission.

**Durations are in seconds.** Pass `60` for one minute, `3600` for one
hour, `86400` for one day.

**Unban requires the bot to be created by the room owner.** This is a
Highrise limitation. If your bot was not created by the room owner,
`unban()` will fail.

**The Moderation event fires for all these actions.** You can listen to
`bot.on('Moderation')` to log or respond to moderation events from any
source, including other moderators.