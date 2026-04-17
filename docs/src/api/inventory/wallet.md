# bot.inventory.wallet

The `bot.inventory.wallet` API checks the bot's currency balances.
Gold, boost tokens, and voice tokens.

## Methods

### get()

Gets the bot's current wallet balance.

```javascript
const wallet = await bot.inventory.wallet.get();

if (wallet.ok) {
    console.log(`Gold: ${wallet.gold}`);
    console.log(`Boost tokens: ${wallet.boostToken}`);
    console.log(`Voice tokens: ${wallet.voiceToken}`);
}
```

**Returns:** [`GetWalletResponse`](#getwalletresponse)

## Complete example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!gold') {
        const wallet = await bot.inventory.wallet.get();

        if (!wallet.ok) {
            await bot.message.send('Could not fetch wallet.');
            return;
        }

        await bot.message.send(`I have ${wallet.gold} gold.`);
        return;
    }

    if (cmd === '!tokens') {
        const wallet = await bot.inventory.wallet.get();

        if (!wallet.ok) {
            await bot.message.send('Could not fetch tokens.');
            return;
        }

        await bot.message.send(
            `Boost tokens: ${wallet.boostToken}\nVoice tokens: ${wallet.voiceToken}`
        );
        return;
    }

    if (cmd === '!balance') {
        const wallet = await bot.inventory.wallet.get();

        if (!wallet.ok) {
            await bot.message.send('Could not fetch balance.');
            return;
        }

        await bot.message.send(
            `Gold: ${wallet.gold}\n` +
            `Boosts: ${wallet.boostToken}\n` +
            `Voice: ${wallet.voiceToken}`
        );
        return;
    }
});
```

## GetWalletResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;

    gold: number;          // current gold balance
    boostToken: number;    // available room boosts
    voiceToken: number;    // available voice time tokens
}
```