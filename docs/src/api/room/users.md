# bot.room.users

The `bot.room.users` API handles everything related to users currently
in the room. Fetch the full user list, find specific users, check
positions, and get user counts.

## Methods

### get()

Fetches all users currently in the room with their positions.

```javascript
const room = await bot.room.users.get();
```

**Returns:** [`GetRoomUsersResponse`](#getroomusersresponse)

The response contains the user array and helper methods for working with
the data.

### count()

Returns the number of users currently in the room.

```javascript
const total = await bot.room.users.count();
console.log(`${total} users online`);
```

**Returns:** `Promise<number>` — 0 if an error occurs

This is a shorthand. It fetches the room and returns just the count.

### has(identifier)

Checks if a user is in the room by their ID or username.

```javascript
const inRoom = await bot.room.users.has('Unfairly');

if (inRoom) {
    await bot.message.send('Unfairly is here!');
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `identifier` | `string` | User ID or username |

**Returns:** `Promise<boolean>`

### find(identifier)

Finds a user in the room and returns their full entry.

```javascript
const entry = await bot.room.users.find('Unfairly');

if (entry) {
    console.log(entry.user.id);
    console.log(entry.user.username);
    console.log(entry.position.x, entry.position.y, entry.position.z);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `identifier` | `string` | User ID or username |

**Returns:** `Promise<UserEntry | null>`

### username(userId)

Gets a user's username from their ID.

```javascript
const name = await bot.room.users.username('user_id_here');
console.log(name); // "Unfairly" or null if not found
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The user's ID |

**Returns:** `Promise<string | null>`

### userId(username)

Gets a user's ID from their username.

```javascript
const id = await bot.room.users.userId('Unfairly');
console.log(id); // "user_id_here" or null if not found
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | `string` | The user's username |

**Returns:** `Promise<string | null>`

### position(identifier)

Gets a user's current position by their ID or username.

```javascript
const pos = await bot.room.users.position('Unfairly');

if (pos) {
    console.log(`${pos.x}, ${pos.y}, ${pos.z} facing ${pos.facing}`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `identifier` | `string` | User ID or username |

**Returns:** `Promise<Position | AnchorPosition | null>`

If the user is sitting, this returns an `AnchorPosition` with
`entity_id` and `anchor_ix`. If walking or standing, it returns a
`Position` with `x`, `y`, `z`, and `facing`.

## Complete example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!users') {
        const total = await bot.room.users.count();
        await bot.message.send(`There are ${total} users in the room.`);
        return;
    }

    if (cmd === '!find') {
        const target = message.mentions(0) || message.args(0);

        if (!target) {
            await bot.message.send('Usage: !find @username');
            return;
        }

        const entry = await bot.room.users.find(target);

        if (!entry) {
            await bot.message.send(`${target} is not in the room.`);
            return;
        }

        if ('entity_id' in pos) {
            await bot.message.send(`${entry.user.username} are sitting on ${pos.entity_id}`);
        } else {
            await bot.message.send(
                `${entry.user.username} is at ${entry.position.x}, ${entry.position.z}`
            );
        }
        
        return;
    }

    if (cmd === '!pos') {
        const pos = await bot.room.users.position(user.id);

        if (!pos) {
            await bot.message.send('Could not find your position.');
            return;
        }

        if ('entity_id' in pos) {
            await bot.message.send(`You are sitting on ${pos.entity_id}`);
        } else {
            await bot.message.send(`You are at ${pos.x}, ${pos.y}, ${pos.z}`);
        }

        return;
    }
});
```

## GetRoomUsersResponse

Returned by `bot.room.users.get()`:

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;

    users: UserEntry[];                     // array of users and positions

    count(): number;                        // number of users
    has(identifier: string): boolean;       // check if user is present
    find(identifier: string): UserEntry | null;
    position(identifier: string): Position | AnchorPosition | null;
    username(userId: string): string | null;
    userId(username: string): string | null;
}
```

## Important things to know

**All methods accept either a user ID or username.** You can pass
whichever you have. The API figures out which one you meant, except `username()` and `userId()`.

**Usernames are case-insensitive in lookups.** `'Unfairly'` and `'unfairly'` are
the same.

**Sitting users have AnchorPosition.** When a user is sitting, their
position object has `entity_id` and `anchor_ix` instead of `x`, `y`, `z`.
Check for the presence of `entity_id` or `x` to know which type you have.

**Shorthand methods make a network request each time.** Calling
`bot.room.users.count()` three times makes three separate requests to
Highrise. If you need multiple pieces of information, call `.get()` once
and use the response object.