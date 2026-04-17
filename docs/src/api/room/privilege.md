# bot.room.privilege

The `bot.room.privilege` API checks the room privileges of any user.
Find out if someone is a moderator or designer without making changes.

## Methods

### get(userId)

Gets all privileges for a specific user.

```javascript
const priv = await bot.room.privilege.get(userId);

if (priv.ok) {
    console.log(`Moderator: ${priv.moderator}`);
    console.log(`Designer: ${priv.designer}`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The ID of the user to check |

**Returns:** [`GetRoomPrivilegeResponse`](#getroomprivilegeresponse)

### isModerator(userId)

Checks if a user is a moderator.

```javascript
const isMod = await bot.room.privilege.isModerator(userId);

if (isMod.error) {
    console.log(`Error: ${isMod.error}`);
} else if (isMod.value) {
    console.log('This user is a moderator');
} else {
    console.log('This user is not a moderator');
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The ID of the user to check |

**Returns:** `Promise<{ value: boolean, error: string | null }>`

### isDesigner(userId)

Checks if a user is a designer.

```javascript
const isDes = await bot.room.privilege.isDesigner(userId);

if (isDes.error) {
    console.log(`Error: ${isDes.error}`);
} else if (isDes.value) {
    console.log('This user is a designer');
} else {
    console.log('This user is not a designer');
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The ID of the user to check |

**Returns:** `Promise<{ value: boolean, error: string | null }>`

## Complete example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!priv') {
        const target = message.mentions(0) || message.args(0)

        const priv = await bot.room.privilege.get(target);

        if (!priv.ok) {
            await bot.message.send('Could not check privileges.');
            return;
        }

        const roles = [];
        if (priv.moderator) roles.push('Moderator');
        if (priv.designer) roles.push('Designer');

        const roleText = roles.length ? roles.join(', ') : 'Member';

        await bot.message.send(`${target} is a ${roleText}`);
        return;
    }

    if (cmd === '!ismod') {
        const target = message.mentions(0)

        const isMod = await bot.room.privilege.isModerator(target);

        if (isMod.error) {
            await bot.message.send('Could not check moderator status.');
            return;
        }

        await bot.message.send(
            isMod.value
                ? `${target} is a moderator.`
                : `${target} is not a moderator.`
        );
        return;
    }
});

// Only allow moderators to use certain commands
bot.on('Chat', (user, message) => {
    if (message.command() === '!kick') {
        const isMod = await bot.room.privilege.isModerator(user.id);

        if (!isMod.value) {
            await bot.message.send('Only moderators can use this command.');
            return;
        }

        // proceed with kick logic
    }
});
```

## GetRoomPrivilegeResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;
    moderator: boolean;    // true if user is a moderator
    designer: boolean;     // true if user is a designer
}
```

## Important things to know

**Privileges are per-room.** A user might be a moderator in one room but
not in another. These methods only check privileges in the current room.

**Room owners are automatically moderators.** The room owner has
special permissions, `isModerator()` returns `true`

**Use `isModerator()` and `isDesigner()` for simple checks.** These
shorthand methods are cleaner than calling `.get()` when you only need
one piece of information.

**The return value is an object with `value` and `error`.** Unlike most
API responses, `isModerator()` and `isDesigner()` return an object with
`value` instead of `ok`. Check `error` first, then use `value`.