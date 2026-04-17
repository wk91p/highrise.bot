# Moderation Event

The Moderation event fires whenever a moderation action occurs in-room. This includes `kick`, `mute`, `ban`, `unmute`, and `unban`. It is commonly used to log staff actions or notify other moderators via `bot.direct.send()`, which we cover on the [Direct](./direct.md) event page.

## Event structure

```javascript
bot.on('Moderation', async (moderator, target, action) => {

});
```

You get three things: The `moderator` who did the action, the `target` who got moderated, and the `action` object which have `type` and `duration`.

> [!IMPORTANT]
> While `Moderator` and `Target` classes inherit from the `User` class, the Highrise WebSocket server emits moderation events containing **only the user ID**. as a result, the `username` field will always be `null`, since you already know `User` class structure at this point, and no need to explain what it has.

## The action object

```javascript
bot.on('Moderation', async (moderator, target, action) => {
    console.log(action.type);     // The type of moderation action performed
    console.log(action.duration); // The length of the action (in seconds), or null if not applicable
});
```
There are 5 types of moderation actions. Note that only mute and ban include a duration; for others, the duration will be null.

| Action Type | Has Duration? |
|---|---|
| kick | false |
| mute | true |
| ban | true |
| unmute | false |
| unban | false |

## Common patterns

### Logging all moderation actions

A simple way to keep a record of everything that happens in your room:

```javascript
bot.on('Moderation', async (moderator, target, action) => {
    const duration = action.duration
        ? `for ${action.duration} seconds`
        : '';

    log.info(
        'Moderation',
        `${moderator.id} [${action.type}] ${target.id} ${duration}`
    );
});
```

### Tracking moderation history

Keep a log of every action taken against each user:

```javascript
const moderationLog = new Map();

bot.on('Moderation', async (moderator, target, action) => {
    // get existing history or create new one for this target
    const history = moderationLog.get(target.id) || [];

    // add details to his history
    history.push({
        type: action.type,
        duration: action.duration,
        moderatorId: moderator.id,
        timestamp: Date.now(),
    });

    // set the new updated history to the target in Map()
    moderationLog.set(target.id, history);

    // log it
    log.info(
        'Moderation',
        `${moderator.id} ${action.type} ${target.id}. Total actions against the user: ${history.length}`
    );
});
```

## Summary

- The Moderation event fires on kicks, bans, mutes, unmutes, and unbans
- You get the `moderator` who acted, the `target` who was moderated, and the `action` details
- `action.type` is always one of `"kick"`, `"ban"`, `"mute"`, `"unmute"`, or `"unban"`
- `action.duration` is set for mutes and bans, `null` for everything else
- Common uses are logging, public announcements, escalation systems, and user protection
- You can react to moderation actions and even undo them if needed