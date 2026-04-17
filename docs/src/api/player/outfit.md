# bot.player.outfit

The `bot.player.outfit` API fetches the current outfit of any user in
the room. See what items they are wearing.

## Methods

### get(userId)

Gets the full outfit of a specific user.

```javascript
const result = await bot.player.outfit.get(userId);

if (result.ok) {
    console.log(`User is wearing ${result.count} items`);

    result.outfit.forEach(item => {
        console.log(`${item.type}: ${item.id}`);
    });
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | ID of the user whose outfit to fetch |

**Returns:** [`GetUserOutfitResponse`](#getuseroutfitresponse)

## Complete example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!outfit') {
        const target = message.mentions(0) || message.args(0);
        const found = await bot.room.users.find(target);

        if (!found) {
            bot.message.send(`${target} is not in the room.`);
            return;
        }

        const result = await bot.player.outfit.get(found.user.id);

        if (!result.ok) {
            await bot.message.send('Could not fetch outfit.');
            return;
        }

        await bot.message.send(`${target} is wearing ${result.count} items.`);
        return;
    }

    if (cmd === '!hasshirt') {
        const target = message.mentions(0)
        if (!target) {
            
        }

        const found = await bot.room.users.find(target);

        if (!found) {
            await bot.message.send(`${target} is not in the room.`);
            return;
        }

        const result = await bot.player.outfit.get(found.user.id);

        if (!result.ok) {
            await bot.message.send('Could not check outfit.');
            return;
        }

        if (result.has('shirt-f_marchingband')) {
            await bot.message.send(`${target} is wearing the marching band shirt!`);
        } else {
            await bot.message.send(`${target} is not wearing that shirt.`);
        }
        return;
    }
});

bot.on('UserJoined', (user) => {
    const result = await bot.player.outfit.get(user.id);

    if (result.ok && result.has('hat-crown')) {
        await bot.message.send(`All hail ${user.username}, wearer of the crown!`);
    }
});
```

## GetUserOutfitResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;

    outfit: OutfitItem[];      // array of items the user is wearing
    count: number;             // number of items
    has(itemId: string): boolean;        // check if wearing specific item
    find(itemId: string): OutfitItem;     // get specific item by ID
}
```

### OutfitItem

```typescript
{
    type: string;           // item type
    amount: number;         // quantity owned
    id: string;             // unique item identifier
    account_bound: boolean; // whether item is bound to account
    active_palette: number; // color palette index
}
```

## Important things to know
**Use `has()` for quick checks.** Instead of looping through the outfit
array, use `outfit.has('item-id')` to check for a specific item.

**Use `find()` to get item details.** If you need the full item object
including `active_palette` or `account_bound`, use `outfit.find('item-id')`.

**Item IDs are unique strings.** They follow patterns like
`'shirt-f_marchingband'`. You can find item IDs in the
Highrise shop or by inspecting a user's outfit.