# bot.inventory

The `bot.inventory` API handles everything related to the bot's owned
items, wallet balance, and purchases. Check gold, manage outfits, buy
items from the shop, and purchase room boosts.

## What lives on bot.inventory

```javascript
bot.inventory.wallet    // check gold, boost tokens, voice tokens
bot.inventory.outfit    // get and set the bot's current outfit
bot.inventory.item      // buy items from the Highrise shop
bot.inventory.boost     // buy room boosts
bot.inventory.get()     // get the bot's full clothing inventory
```

## When to use each

| API | Use when you need to... |
|-----|-------------------------|
| `bot.inventory.wallet.get()` | Check the bot's gold or token balance |
| `bot.inventory.outfit.get()` | See what the bot is currently wearing |
| `bot.inventory.outfit.set()` | Change the bot's outfit |
| `bot.inventory.item.buy()` | Purchase an item from the shop |
| `bot.inventory.boost.buy()` | Purchase room boosts |
| `bot.inventory.get()` | Get a list of all clothing the bot owns |

## Quick examples

### Check gold balance
```javascript
const wallet = await bot.inventory.wallet.get();
console.log(`Gold: ${wallet.gold}`);
```

### Change the bot's outfit
```javascript
await bot.inventory.outfit.set(); // if no outfit passed, set back to default
```

### Buy an item
```javascript
const result = await bot.inventory.item.buy('shirt-f_marchingband');
if (result.success) {
    console.log('Item purchased!');
}
```

### Get full inventory
```javascript
const inventory = await bot.inventory.get();
console.log(`Bot owns ${inventory.count} items`);
```

## Important things to know

**Purchases use the bot's gold.** Make sure the bot has enough gold
before attempting to buy items or boosts.

**Outfit changes are visible to everyone.** When you change the bot's
outfit, all users in the room will see the change immediately.

**Inventory is all owned clothing.** `bot.inventory.get()` returns every
clothing item the bot owns, not just what it is currently wearing.