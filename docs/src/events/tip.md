# Tip Event

The Tip event fires whenever a gold transaction occurs. This includes transfers between two players in a room, between a player and a bot, or via DM bot tips. It is commonly used to automate gold-based subscriptions.

## Event structure

```javascript
bot.on('Tip', async (sender, receiver, currency) => {

});
```

You get three things: the `sender` who sent the tip, the `receiver` who received it, and the `currency` object containing the specific tip information like the `amount` and `type`.

## The sender and receiver objects

Both the `sender` and `receiver` objects inherit from the `User` object, which contains the `id` and `username`.

```javascript
bot.on('Tip', async (sender, receiver, currency) => {
    console.log(sender.id)        // sender unique Highrise ID
    console.log(sender.username)  // sender display name

    console.log(receiver.id)        // receiver unique Highrise ID
    console.log(receiver.username)  // receiver display name
});
```

## the currency object
```javascript
bot.on('Tip', async (sender, receiver, currency) => {
    console.log(currency.amount)  // currency amount that got tipped
    console.log(currency.type)  // type of the currency that got tipped (usually gold)
});
```

Gold tips in Highrise can only be sent in specific denominations. You will always get one of these values for `currency.amount`:

| Amount | Name |
|--------|------|
| 1 | 1 gold bar |
| 5 | 5 gold bars |
| 10 | 10 gold bars |
| 50 | 50 gold bars |
| 100 | 100 gold bars |
| 500 | 500 gold bars |
| 1000 | 1k gold bars |
| 5000 | 5k gold bars |
| 10000 | 10k gold bars |

## Common patterns

### Thanking tippers

The most basic use of this event is acknowledging tips in chat:

```javascript
bot.on('Tip', async (sender, receiver, currency) => {
    await bot.message.send(
        `Thank you ${sender.username} for the ${currency.amount} gold!`
    );
});
```

### Detecting tips to the bot specifically

If you only want to react when someone tips the bot and not when users tip each other:

```javascript
bot.on('Tip', async (sender, receiver, currency) => {
    if (receiver.id !== bot.metadata.bot_id) return;

    await bot.message.send(
        `${sender.username} just tipped the bot ${currency.amount} gold!`
    );
});
```


## Summary

- The Tip event fires every time someone tips in the room
- You get the `sender`, `receiver`, and `currency` objects
- `currency.amount` is always one of the valid gold bar denominations
- Check `receiver.id === bot.metadata.bot_id` if you only want to react to tips sent to the bot
- Common uses are thank you messages, leaderboards, tip rewards, and voting systems
- Use `rewardedUsers` sets or similar guards to prevent rewards from triggering multiple times