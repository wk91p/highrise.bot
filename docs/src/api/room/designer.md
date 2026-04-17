# bot.room.designer

The `bot.room.designer` API grants and removes designer privileges in
the current room. Designers can edit the room's furniture and layout.

> [!IMPORTANT]
> The bot must be made by room owner to grant or remove designer
> privileges. If the bot lacks permission, requests will fail.

## Methods

### add(userId)

Grants designer privileges to a user.

```javascript
const result = await bot.room.designer.add(userId);

if (result.ok) {
    await bot.message.send('User is now a designer');
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The ID of the user to promote |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

### remove(userId)

Removes designer privileges from a user.

```javascript
const result = await bot.room.designer.remove(userId);

if (result.ok) {
    await bot.message.send('User is no longer a designer');
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

    if (cmd === '!designer') {
        // only room owner can grant designer
        if (user.id !== bot.metadata?.room.owner_id) {
            await bot.message.send('Only the room owner can use this command.');
            return;
        }

        const target = message.mentions(0) || message.args(0);

        if (!target) {
            await bot.message.send('Usage: !designer @username');
            return;
        }

        const found = await bot.room.users.find(target);

        if (!found) {
            await bot.message.send(`${target} is not in the room.`);
            return;
        }

        // check if already a designer
        const isDes = await bot.room.privilege.isDesigner(found.user.id);

        if (isDes.value) {
            const result = await bot.room.designer.remove(found.user.id);

            if (!result.ok) {
                await bot.message.send(`Could not remove designer: ${result.error}`);
                return;
            }

            await bot.message.send(`${target} is no longer a designer.`);
        } else {
            const result = await bot.room.designer.add(found.user.id);

            if (!result.ok) {
                await bot.message.send(`Could not add designer: ${result.error}`);
                return;
            }

            await bot.message.send(`${target} is now a designer.`);
        }
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

## Important things to know

**Designer privileges allow furniture editing.** Users with designer can
move, add, and remove furniture in the room. Be careful who you grant
this to.