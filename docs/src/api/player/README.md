# bot.player

The `bot.player` API handles everything related to player actions and
interactions. Move the bot, teleport users, send emotes, react to users,
tip gold, and moderate players. This is the overview page. Each sub-api
has its own dedicated page with full details.

## What lives on bot.player

```javascript
bot.player.walk()        // move the bot to coordinates
bot.player.sit()         // make the bot sit on furniture
bot.player.teleport()    // teleport a user to coordinates
bot.player.emote()       // send an emote
bot.player.react()       // send a reaction to a user
bot.player.tip()         // tip a user with gold
bot.player.splitTip()    // tip large amounts split into valid denominations
bot.player.transport()   // send a user to another room
bot.player.moderation    // kick, mute, ban, unmute, unban users
bot.player.outfit        // fetch a player's current outfit
```

## When to use each

| API | Use when you need to... |
|-----|-------------------------|
| `bot.player.walk()` | Move the bot to a specific spot in the room |
| `bot.player.sit()` | Make the bot sit on a chair or couch |
| `bot.player.teleport()` | teleport a user to a specific location |
| `bot.player.emote()` | Make the bot or the user to perform any emote |
| `bot.player.react()` | Send a heart, clap, or other reaction to a user |
| `bot.player.tip()` | Send gold to a user (valid denominations only) |
| `bot.player.splitTip()` | Send any amount of gold (auto-splits into valid amounts) |
| `bot.player.transport()` | Send a user to a different room |
| `bot.player.moderation` | Kick, mute, or ban users from the room |
| `bot.player.outfit` | See what items a user is wearing |

## Quick examples

### Move the bot
```javascript
await bot.player.walk(10, 0, 5, 'FrontRight');
```

### Send a reaction
```javascript
await bot.player.react(userId, 'heart');
```

### Tip a user
```javascript
const result = await bot.player.tip(userId, 100);
if (result.result === 'success') {
    await bot.message.send('Tip sent!');
}
```

### Kick a user
```javascript
await bot.player.moderation.kick(userId);
```

### Check a user's outfit
```javascript
const outfit = await bot.player.outfit.get(userId);
if (outfit.has('shirt-f_marchingband')) {
    console.log('They are wearing the marching band shirt');
}
```

## Important things to know

**Coordinates are room-specific.** The valid coordinate range depends on
the room size. Most rooms are 20x20 or larger.

**Tipping uses specific denominations.** Gold can only be sent in amounts
of 1, 5, 10, 50, 100, 500, 1000, 5000, or 10000. Use `splitTip()` to
send arbitrary amounts.

**Moderation requires permissions.** Your bot must be a moderator to
kick, mute, or ban users.

**All methods return responses with `ok` and `error`.** Always check
`result.ok` for important operations.