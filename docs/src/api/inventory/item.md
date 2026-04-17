# bot.inventory.item

The `bot.inventory.item` API handles purchasing items directly from the
Highrise shop using the bot's gold.

## Methods

### buy(itemId)

Purchases a specific shop item using the bot's gold.

```javascript
const result = await bot.inventory.item.buy('shirt-f_marchingband');

if (result.insufficientFunds) {
    console.log('Not enough gold');
} else if (result.success) {
    console.log('Item purchased!');
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `itemId` | `string` | The unique shop item ID to purchase |

**Returns:** [`BuyItemResponse`](#buyitemresponse)

## Example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command()
    if (cmd === '!buy') {
        const itemId = message.args(0);

        if (!itemId) {
            await bot.message.send('Usage: !buy <itemId>');
            return;
        }

        const result = await bot.inventory.item.buy(itemId);

        if (result.insufficientFunds) {
            await bot.message.send('Not enough gold!');
            return;
        }

        if (!result.ok) {
            await bot.message.send('Purchase failed.');
            return;
        }

        await bot.message.send(`Purchased ${itemId}!`);
        return;
    }
});
```

## BuyItemResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;
    result: "success" | "insufficient_funds" | "only_token_bought";
    success: boolean;               // true if purchase succeeded
    insufficientFunds: boolean;     // true if failed due to low gold
}
```

## Important things to know

**Item IDs are unique strings.** Find them in the Highrise shop. Common
format: `'type-name'` like `'shirt-f_marchingband'`.

**Purchased items go to inventory.** After a successful purchase, the
item is added to the bot's inventory and can be equipped.