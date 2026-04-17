# bot.inventory.outfit

The `bot.inventory.outfit` API manages the bot's current appearance.
Get what the bot is wearing, change outfits, add or remove individual
items, and change item colors.

## Methods

### get()

Gets the bot's current outfit. The result is cached after the first call.

```javascript
const result = await bot.inventory.outfit.get();

if (result.ok) {
    console.log(`Bot is wearing ${result.count} items`);
    result.outfit.forEach(item => console.log(item.id));
}
```

**Returns:** [`GetBotOutfitResponse`](#getbotoutfitresponse)

> **Note:** This method requires no parameters. It automatically uses
> the bot's own ID from the connection metadata.

### set(outfit)

Changes the bot's entire outfit at once. Pass an array of `OutfitItem`
objects or plain objects matching the structure.

```javascript
const { OutfitItem } = require('highrise.bot');

// Using OutfitItem helper class
const newOutfit = [
    new OutfitItem('shirt-f_marchingband', 2),
    new OutfitItem('hat-beanie'),
    new OutfitItem('pants-jeans')
];
await bot.inventory.outfit.set(newOutfit);

// Reset to default appearance
await bot.inventory.outfit.set();
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `outfit` | `OutfitItem[]` | Array of items to equip (optional, resets if omitted) |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

### add(outfitItem)

Adds a single item to the bot's current outfit without affecting other
items.

```javascript
const { OutfitItem } = require('highrise.bot');

const newHat = new OutfitItem('hat-beanie', 1);
const result = await bot.inventory.outfit.add(newHat);

if (!result.ok) {
    console.log(`Failed to add item: ${result.error}`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `outfitItem` | `OutfitItem` | The item to add (must be an OutfitItem instance) |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

### remove(itemId)

Removes a specific item from the bot's current outfit.

```javascript
const result = await bot.inventory.outfit.remove('hat-beanie');

if (result.ok) {
    console.log('Hat removed from outfit');
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `itemId` | `string` | The ID of the item to remove |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

### color(itemId, colorIndex)

Changes the color palette of a specific item the bot is currently wearing.

```javascript
// Change shirt to palette index 3
const result = await bot.inventory.outfit.color('shirt-f_marchingband', 3);

if (result.ok) {
    console.log('Color changed');
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `itemId` | `string` | The ID of the item to recolor |
| `colorIndex` | `number` | The new palette index (default: 0) |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

## Complete example

```javascript
const { Highrise, OutfitItem, Logger } = require('highrise.bot');

const log = new Logger({ prefix: "FashionBot" });
const bot = new Highrise();

bot.once('Ready', async () => {
    const result = await bot.inventory.outfit.get();

    if (result.ok) {
        log.info('Bot', `Wearing ${result.count} items`);
    }
});

bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!outfit') {
        const result = await bot.inventory.outfit.get();

        if (!result.ok) {
            await bot.message.send('Could not fetch outfit.');
            return;
        }

        const items = result.outfit
        await bot.message.send(`I am wearing: ${items.join(', ')}`);
        return;
    }

    if (cmd === '!addhat') {
        const hatId = message.args(0) || 'hat-beanie';
        const color = Number(message.args(1)) || 0;

        const newHat = new OutfitItem(hatId, color);
        const result = await bot.inventory.outfit.add(newHat);

        if (!result.ok) {
            await bot.message.send(`Could not add hat: ${result.error}`);
            return;
        }

        await bot.message.send(`Added ${hatId} to my outfit!`);
        return;
    }

    if (cmd === '!remove') {
        const itemId = message.args(0);

        if (!itemId) {
            await bot.message.send('Usage: !remove <itemId>');
            return;
        }

        const result = await bot.inventory.outfit.remove(itemId);

        if (!result.ok) {
            await bot.message.send(`Could not remove item: ${result.error}`);
            return;
        }

        await bot.message.send(`Removed ${itemId} from my outfit.`);
        return;
    }

    if (cmd === '!recolor') {
        const itemId = message.args(0);
        const color = Number(message.args(1));

        if (!itemId || isNaN(color)) {
            await bot.message.send('Usage: !recolor <itemId> <colorIndex>');
            return;
        }

        const result = await bot.inventory.outfit.color(itemId, color);

        if (!result.ok) {
            await bot.message.send(`Could not recolor: ${result.error}`);
            return;
        }

        await bot.message.send(`Changed ${itemId} to palette ${color}`);
        return;
    }

    if (cmd === '!royal') {
        const royalOutfit = [
            new OutfitItem('hat-crown', 2),
            new OutfitItem('shirt-royal', 1),
            new OutfitItem('pants-royal', 0)
        ];

        await bot.inventory.outfit.set(royalOutfit);
        await bot.message.send('Dressed as royalty!');
        return;
    }

    if (cmd === '!reset') {
        await bot.inventory.outfit.set();
        await bot.message.send('Back to default outfit.');
        return;
    }
});

bot.login(process.env.BOT_TOKEN, process.env.ROOM_ID);
```

## OutfitItem

The `OutfitItem` class is available as a named export from `highrise.bot`.
It provides a clean way to create outfit items without writing raw objects.

```javascript
const { OutfitItem } = require('highrise.bot');
```

### Constructor

```javascript
new OutfitItem(id, palette?, amount?, isBound?)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `id` | `string` | required | The item identifier (e.g., `"shirt-f_marchingband"`) |
| `palette` | `number` | `0` | The color palette index |
| `amount` | `number` | `1` | Quantity of the item |
| `isBound` | `boolean` | `false` | Whether the item is account bound |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The unique item identifier |
| `type` | `string` | Extracted from the ID (e.g., `"shirt"`, `"hat"`) |
| `amount` | `number` | Quantity of the item |
| `account_bound` | `boolean` | Whether bound to the account |
| `active_palette` | `number` | The color palette index |

### Examples

```javascript
// Basic usage
const hat = new OutfitItem('hat-beanie');

// With custom color palette
const shirt = new OutfitItem('shirt-f_marchingband', 2);

// Full options
const special = new OutfitItem('shoes-rare', 1, 1, true);

// Use in outfit changes
await bot.inventory.outfit.set([hat, shirt, special]);
await bot.inventory.outfit.add(new OutfitItem('pants-jeans'));
```

## Response Types

### GetBotOutfitResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;

    outfit: OutfitItem[];   // items currently equipped
    count: number;          // number of items
    has(itemId: string): boolean;
    find(itemId: string): OutfitItem;
}
```

### AcknowledgmentResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;
}
```

## Important things to know

**The outfit is cached.** The first call to `get()` fetches from the API.
Subsequent calls return the cached outfit until `set()`, `add()`,
`remove()`, or `color()` is called.

**Gold paid Items must be owned.** You can only equip items the bot has in its
inventory. Attempting to equip unowned items will fail.

**Reset with no arguments.** Calling `set()` with no arguments resets
the bot to its default appearance.

**Changes are immediate.** Everyone in the room sees outfit changes as
soon as the request completes.

**`color()` only works on currently worn items.** The item must already
be part of the bot's current outfit.