# bot.roles

The `bot.roles` API provides role-based access control for your bot. Room moderators and the owner are automatically synced on startup and refreshed every 10 minutes. Custom roles can be assigned and managed at runtime.

> [!NOTE]
> `"owner"` and `"mod"` are protected roles, they are managed automatically by the SDK and cannot be manually modified via `addRole`, `removeRole`, or `clearRoles`.

## Methods

### hasRole(userId, role)

Checks if a user has a specific role.

```javascript
if (bot.roles.hasRole(user.id, "vip")) {
    await bot.message.send(`Welcome back, VIP!`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The user's unique ID |
| `role` | `string` | The role to check for |

**Returns:** `boolean`

### hasAnyRole(userId, roles)

Checks if a user has at least one of the specified roles.

```javascript
if (bot.roles.hasAnyRole(user.id, ["vip", "mod", "owner"])) {
    await bot.message.send(`You have access.`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The user's unique ID |
| `roles` | `string[]` | List of roles to check against |

**Returns:** `boolean`

### hasAllRoles(userId, roles)

Checks if a user has all of the specified roles.

```javascript
if (bot.roles.hasAllRoles(user.id, ["vip", "trusted"])) {
    await bot.message.send(`You have full access.`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The user's unique ID |
| `roles` | `string[]` | List of roles to check against |

**Returns:** `boolean`

### addRole(userId, role)

Assigns a role to a user. Returns `false` if the user already has the role or if the role is protected.

```javascript
const added = bot.roles.addRole(user.id, "vip");

if (!added) {
    await bot.message.send(`User already has this role or it is protected.`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The user's unique ID |
| `role` | `string` | The role to assign |

**Returns:** `boolean`

> [!NOTE]
> `"mod"` and `"owner"` are protected and cannot be assigned manually.

### removeRole(userId, role)

Removes a role from a user. Returns `false` if the role doesn't exist or is protected.

```javascript
const removed = bot.roles.removeRole(user.id, "vip");

if (!removed) {
    await bot.message.send(`Could not remove role.`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The user's unique ID |
| `role` | `string` | The role to remove |

**Returns:** `boolean`

> [!NOTE]
> `"mod"` and `"owner"` are protected and cannot be removed manually.

### getRoles(userId)

Returns all roles currently assigned to a user.

```javascript
const roles = bot.roles.getRoles(user.id);
await bot.message.send(`Your roles: ${roles.join(', ')}`);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The user's unique ID |

**Returns:** `string[]`

### setRoles(userId, roles)

Replaces all of a user's custom roles with the specified list.

```javascript
bot.roles.setRoles(user.id, ["vip", "trusted"]);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The user's unique ID |
| `roles` | `string[]` | The new list of roles to assign |

**Returns:** `true`

### clearRoles(userId)

Removes all custom roles from a user.

```javascript
bot.roles.clearRoles(user.id);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The user's unique ID |

**Returns:** `true`

> [!NOTE]
> `"mod"` and `"owner"` are always skipped.

### isOwner(userId)

Checks if a user is the room owner.

```javascript
if (bot.roles.isOwner(user.id)) {
    await bot.message.send(`Hello, owner!`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The user's unique ID |

**Returns:** `boolean`

### isModerator(userId)

Checks if a user is a room moderator.

```javascript
if (bot.roles.isModerator(user.id)) {
    await bot.message.send(`Hello, moderator!`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The user's unique ID |

**Returns:** `boolean`

## Complete example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!addrole') {
        if (!bot.roles.isModerator(user.id)) {
            await bot.message.send(`You don't have permission to assign roles.`);
            return;
        }

        const target = message.args(0);
        const role = message.args(1);

        if (!target || !role) {
            await bot.message.send(`Usage: !addrole <userId> <role>`);
            return;
        }

        const added = bot.roles.addRole(target, role);
        await bot.message.send(added ? `Role "${role}" assigned.` : `Could not assign role.`);
        return;
    }

    if (cmd === '!removerole') {
        if (!bot.roles.isModerator(user.id)) {
            await bot.message.send(`You don't have permission to remove roles.`);
            return;
        }

        const target = message.args(0);
        const role = message.args(1);

        if (!target || !role) {
            await bot.message.send(`Usage: !removerole <userId> <role>`);
            return;
        }

        const removed = bot.roles.removeRole(target, role);
        await bot.message.send(removed ? `Role "${role}" removed.` : `Could not remove role.`);
        return;
    }

    if (cmd === '!roles') {
        const roles = bot.roles.getRoles(user.id);
        await bot.message.send(roles.length ? `Your roles: ${roles.join(', ')}` : `You have no roles.`);
        return;
    }
});
```

## Persistence

Roles can be saved to a file by passing `persistPath` in the constructor options. The file is saved every 7.5 minutes and on process exit.

```javascript
const bot = new Highrise({
    roles: {
        persistPath: "./roles.json"
    }
})
```

The file is a simple JSON object mapping role names to user ID arrays:

```json
{
  "owner": ["user-owner"],
  "mod": ["user-mod1", "user-mod2"],
  "vip": ["user-123", "user-456"]
}
```

## Important things to know

**`"owner"` and `"mod"` are read-only.** They are synced from the room every 10 minutes and cannot be mutated via any of the role management methods.

**Roles are in-memory by default.** Without `persistPath`, all custom roles are lost on restart.

**`addRole` returns `false` for duplicates.** If the user already has the role, nothing changes and `false` is returned.

**`clearRoles` skips protected roles.** Calling `clearRoles` on the owner or a moderator will remove their custom roles but never touch `"owner"` or `"mod"`.