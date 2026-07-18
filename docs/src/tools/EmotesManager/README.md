# bot.emotes

The `bot.emotes` API provides access to all Highrise emotes available in the game. Use it to look up emotes by ID, name, or index, useful for building emote commands or any feature that needs to reference a specific emote.

## Methods

### getById(emoteId)

Retrieves an emote by its unique ID.

```javascript
const emote = bot.emotes.getById("sit-idle-cute");

if (emote) {
    console.log(`${emote.name} - ${emote.duration}s`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `emoteId` | `string` | The emote's unique ID (e.g. `"sit-idle-cute"`) |

**Returns:** [`Emote`](#emote) or `null`

### getByName(emoteName)

Retrieves an emote by its display name.

```javascript
const emote = bot.emotes.getByName("Rest");

if (emote) {
    console.log(`${emote.id} - ${emote.duration}s`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `emoteName` | `string` | The emote's display name (e.g. `"Rest"`) |

**Returns:** [`Emote`](#emote) or `null`

### getByIndex(index)

Retrieves an emote by its zero-based index position in the internal list.

```javascript
const first = bot.emotes.getByIndex(0);
const last = bot.emotes.getByIndex(bot.emotes.size - 1);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `index` | `number` | Zero-based index position of the emote |

**Returns:** [`Emote`](#emote) or `null`

### getIndexByName(emoteName)

Returns the zero-based index of an emote by its name.

```javascript
const index = bot.emotes.getIndexByName("Rest");

if (index !== null) {
    console.log(`Rest is emote #${index}`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `emoteName` | `string` | The emote's display name |

**Returns:** `number` or `null`

### getAll()

Returns all available emotes as an array.

```javascript
const emotes = bot.emotes.getAll();

emotes.forEach(emote => {
    console.log(`${emote.name}: ${emote.id} (${emote.duration}s)`);
});
```

**Returns:** [`Emote[]`](#emote)

### size

Returns the total number of emotes available.

```javascript
console.log(`${bot.emotes.size} emotes available`);
```

**Returns:** `number`

## Complete example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!emote') {
        const query = message.args(0);

        if (!query) {
            await bot.message.send('Usage: !emote <name or id>');
            return;
        }

        const emote = bot.emotes.getByName(query)
            ?? bot.emotes.getById(query);

        if (!emote) {
            await bot.message.send(`No emote found for: ${query}`);
            return;
        }

        await bot.player.emote(emote.id, user.id);
        return;
    }

    if (cmd === '!emotes') {
        const total = bot.emotes.size;
        await bot.message.send(`There are ${total} emotes available.`);
        return;
    }
});
```

## Emote

```typescript
{
    id: string;          // unique emote identifier (e.g. "sit-idle-cute")
    name: string;        // display name (e.g. "Rest")
    duration: number;    // emote duration in seconds (e.g. 17.06)
}
```

## Important things to know

**Name lookup is case-sensitive.** `getByName("rest")` will not match `"Rest"`. Make sure to match the casing exactly or normalize the input before calling.

**Index is zero-based.** `getByIndex(0)` returns the first emote, not the second. Use `size - 1` for the last.

**`getByIndex` returns `null` for out-of-range values.** Negative indices and indices beyond `size - 1` return `null`.

**`getIndexByName` returns `null` if not found.** Always check for `null` before using the result as a number.