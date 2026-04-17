# bot.room

The `bot.room` API handles everything related to the room your bot is
currently in. Users, voice chat, privileges, and moderation all live
here. This is the overview page. Each sub-api has its own dedicated page
with full details.

## What lives on bot.room

```javascript
bot.room.users       // fetch users, find by name or ID, check positions
bot.room.voice       // check voice status, invite speakers, remove speakers
bot.room.privilege   // check moderator/designer status of any user
bot.room.moderator   // grant or remove moderator privileges
bot.room.designer    // grant or remove designer privileges
```

## When to use each

| API | Use when you need to... |
|-----|-------------------------|
| `bot.room.users` | Know who is in the room, find a user's ID, check someone's position |
| `bot.room.voice` | Check who is speaking, invite someone to voice, remove a speaker |
| `bot.room.privilege` | Check if a user is a moderator or designer |
| `bot.room.moderator` | Promote or demote moderators |
| `bot.room.designer` | Promote or demote designers |

## Quick examples

### Get all users in the room
```javascript
const room = await bot.room.users.get();
console.log(`There are ${room.count()} users in the room`);
```

### Check if someone is a moderator
```javascript
const isMod = await bot.room.privilege.isModerator(userId);
if (isMod.value) {
    console.log('This user is a moderator');
}
```

### Promote someone to moderator
```javascript
const result = await bot.room.moderator.add(userId);
if (result.ok) {
    await bot.message.send('User is now a moderator');
}
```

### Invite someone to voice chat
```javascript
const result = await bot.room.voice.invite(userId);
if (result.ok) {
    await bot.whisper.send(userId, 'You can now speak in voice chat');
}
```

## Important things to know

**All data is current as of the moment you call the method.** Room state
changes constantly as users join, leave, and move. Each call to
`bot.room.users.get()` fetches fresh data.

**Shorthand methods exist for common lookups.** Instead of calling
`.get()` and then a method on the result, you can call the method
directly:

```javascript
// these do the same thing
const room = await bot.room.users.get();
const count = room.count();

// shorthand
const count = await bot.room.users.count();
```

Use shorthand when you only need one piece of information. Use `.get()`
when you need multiple pieces so you are not making multiple network
requests.

**Moderator and designer changes require proper permissions.** The bot
must be made by the room owner to have permission. If the bot lacks permission, the response
will have `ok: false` with an error message.