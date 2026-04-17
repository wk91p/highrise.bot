# bot.inventory.boost

The `bot.inventory.boost` API handles purchasing room boosts. Boosts
increase your room's visibility in the Highrise room browser.

> [!CAUTION]
> Might not work in future updates, will be tested after each update.

## Methods

### buy(amount)

Purchases room boosts using the bot's gold.

```javascript
// Buy 1 boost (default)
const result = await bot.inventory.boost.buy();

// Buy multiple boosts
const result = await bot.inventory.boost.buy(5);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `amount` | `number` | Number of boosts to purchase (default: 1) |

**Returns:** [`BuyRoomBoostResponse`](#buyroomboostresponse)

## Example

```javascript
bot.on('Chat', async (user, message) => {
    if (message.command() === '!boost') {
        const amount = Number(message.args(0)) || 1;

        const result = await bot.inventory.boost.buy(amount);

        if (result.insufficientFunds) {
            await bot.message.send('Not enough gold!');
            return;
        }

        if (!result.ok) {
            await bot.message.send('Boost purchase failed.');
            return;
        }

        await bot.message.send(`Purchased ${amount} boost(s)!`);
        return;
    }
});
```

## BuyRoomBoostResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;
    result: "success" | "insufficient_funds";
    success: boolean;               // true if purchase succeeded
    insufficientFunds: boolean;     // true if failed due to low gold
}
```

## Important things to know

**Boosts cost 100 gold.** Make sure the bot has enought gold

**Boosts increase room visibility.** Rooms with active boosts appear
higher in the room browser, attracting more users.

**Default amount is 1.** Calling `buy()` with no arguments purchases
a single boost.