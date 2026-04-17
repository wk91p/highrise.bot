# bot.room.moderator

The `bot.room.moderator` API grants and removes moderator privileges
in the current room. Moderators can kick, mute, and ban users. They can
also invite others to voice chat.

> [!IMPORTANT]
> The bot must be made my room owner to grant or remove moderator
> privileges. If the bot lacks permission, requests will fail.

## Methods

### add(userId)

Grants moderator privileges to a user.

```javascript
const result = await bot.room.moderator.add(userId);

if (result.ok) {
    await bot.message.send('User is now a moderator');
} else {
    console.log(`Failed: ${result.error}`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The ID of the user to promote |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

### remove(userId)

Removes moderator privileges from a user.

```javascript
const result = await bot.room.moderator.remove(userId);

if (result.ok) {
    await bot.message.send('User is no longer a moderator');
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The ID of the user to demote |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

## Complete example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!promote') {
        // only room owner can promote
        if (user.id !== bot.metadata?.room.owner_id) {
            await bot.message.send('Only the room owner can use this command.');
            return;
        }

        const target = message.mentions(0) || message.args(0);

        if (!target) {
            await bot.message.send('Usage: !promote @username');
            return;
        }

        const found = await bot.room.users.find(target);

        if (!found) {
            await bot.message.send(`${target} is not in the room.`);
            return;
        }

        const result = await bot.room.moderator.add(found.user.id);

        if (!result.ok) {
            await bot.message.send(`Could not promote ${target}: ${result.error}`);
            return;
        }

        await bot.message.send(`${target} is now a moderator.`);
        return;
    }

    if (cmd === '!demote') {
        if (user.id !== bot.metadata?.room.owner_id) {
            await bot.message.send('Only the room owner can use this command.');
            return;
        }

        const target = message.mentions(0) || message.args(0);

        if (!target) {
            await bot.message.send('Usage: !demote @username');
            return;
        }

        const found = await bot.room.users.find(target);

        if (!found) {
            await bot.message.send(`${target} is not in the room.`);
            return;
        }

        const result = await bot.room.moderator.remove(found.user.id);

        if (!result.ok) {
            await bot.message.send(`Could not demote ${target}: ${result.error}`);
            return;
        }

        await bot.message.send(`${target} is no longer a moderator.`);
        return;
    }
});
```

## AcknowledgmentResponse

```typescript
{
    ok: boolean;           // true if the privilege was changed
    error: string | null;  // error message if failed
    hasError(): boolean;
}
```