# bot.player (Actions)

Movement, emotes, reactions, and teleportation. Everything the bot or
users can physically do in the room.

## walk()

Moves the bot to specific coordinates with an optional facing direction.

```javascript
await bot.player.walk(10, 0, 5, 'FrontLeft');
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `x` | `number` | X coordinate (must be >= 0) |
| `y` | `number` | Y coordinate (must be >= 0) |
| `z` | `number` | Z coordinate (must be >= 0) |
| `facing` | `Facing` | Direction to face (default: 'FrontRight') |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

**Facing options:** `'FrontRight'`, `'FrontLeft'`, `'BackRight'`, `'BackLeft'`

## sit()

Makes the bot sit on a furniture anchor.

```javascript
await bot.player.sit('entity_id_here');

// sit on a specific seat
await bot.player.sit('entity_id_here', 2);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `entity_id` | `string` | The furniture entity ID |
| `anchor_ix` | `number` | Which seat to sit on (default: 0) |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

## teleport()

Moves a user to specific coordinates.

```javascript
await bot.player.teleport(userId, 5, 0, 5);

// with facing direction
await bot.player.teleport(userId, 5, 0, 5, 'BackRight');
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | ID of the user to teleport |
| `x` | `number` | X coordinate |
| `y` | `number` | Y coordinate |
| `z` | `number` | Z coordinate |
| `facing` | `Facing` | Direction to face (default: 'FrontRight') |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

## emote()

Sends an emote from the bot or a specific user.

```javascript
// bot performs the emote
await bot.player.emote('dance-macarena');

// specific user performs the emote
await bot.player.emote('wave', userId);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | User to perform the emote (default: bot's own ID) |
| `emoteId` | `string` | The emote ID to perform |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

## react()

Sends a reaction to a user.

```javascript
await bot.player.react(userId, 'heart');
await bot.player.react(userId, 'clap');
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | ID of the user to react to |
| `reaction` | `Reactions` | Reaction type (default: 'heart') |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

**Reaction options:** `'clap'`, `'heart'`, `'thumbs'`, `'wave'`, `'wink'`

## transport()

move a user to a different room the room owner has.

```javascript
await bot.player.transport(userId, 'room_id_here');
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | ID of the user to transport |
| `roomId` | `string` | ID of the destination room |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

## Complete example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!grab') {
        const target = message.mentions(0) || message.args(0);
        const targetId = target ? await bot.room.users.userId(target) : null;

        if (!targetId) {
            return; // silent fail or add an error message
        }

        const myPos = await bot.room.users.position(user.id);
        if (!myPos) return;

        await bot.player.teleport(targetId, myPos.x, myPos.y, myPos.z);
    }

    if (cmd === '!dance') {
        await bot.player.emote('dance-macarena');
        return;
    }

    if (cmd === '!wave') {
        const target = message.mentions(0) || message.args(0);

        if (target) {
            const found = await bot.room.users.find(target);
            if (found) {
                await bot.player.react(found.user.id, 'wave');
                return;
            }
        }
    }

    if (cmd === '!move') {
        const x = Number(message.args(0));
        const z = Number(message.args(1));

        if (isNaN(x) || isNaN(z)) {
            await bot.message.send('Usage: !move <x> <z>');
            return;
        }

        await bot.player.walk(x, 0, z);
        await bot.message.send(`Moving to ${x}, ${z}`);
        return;
    }
});
```

## AcknowledgmentResponse

All action methods return this response:

```typescript
{
    ok: boolean;           // true if the action succeeded
    error: string | null;  // error message if failed
    hasError(): boolean;
}
```

## Important things to know

**Coordinates must be non-negative.** Passing negative values will cause
validation errors before the request is sent.

**Some emotes are paid** The user must have them to be performed on them