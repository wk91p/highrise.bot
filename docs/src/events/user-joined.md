# User Joined Event

The UserJoined event fires every time someone enters your Highrise room.
It gives you the user who joined and where they spawned in the room.

## Event structure

```javascript
bot.on('UserJoined', async (user, position) => {

});
```

## The user object

```javascript
bot.on('UserJoined', async (user, position) => {
    user.id        // their unique Highrise user ID
    user.username  // their display name
});
```

## The position object

The position tells you where in the room they appeared, position has `x`, `y`, `z`, and `facing`:

```javascript
bot.on('UserJoined', async (user, position) => {
    if (position) {
        position.x       // left/right
        position.y       // height
        position.z       // forward/back
        position.facing  // "FrontRight", "FrontLeft", "BackRight", "BackLeft"
    }
});
```

useful if you are
building something like a game that depends on starting positions.

## A complete example

Here is a UserJoined handler that welcomes users and whispers them a
help message, which is a very common pattern:

```javascript
bot.on('UserJoined', async (user, position) => {
    // announce the join in public chat
    await bot.message.send(`Welcome to the room, ${user.username}! 👋`);

    // whisper them something useful privately so the room chat stays clean
    // this way every user gets a personal message without flooding the room
    await bot.whisper.send(
        user.id,
        `Hey ${user.username}! Type !help to see what I can do.`
    );
});
```

## Important things to know

The UserJoined event fires for every single user who enters the room,
including users who leave and come back. If your room is busy, welcome
messages can add up quickly. Keep them short or consider only welcoming
users once per session using a `Set` to track who you have already seen:

```javascript
const welcomed = new Set();

bot.on('UserJoined', async (user, position) => {
    if (welcomed.has(user.id)) {
        return;
    }

    welcomed.add(user.id);
    await bot.message.send(`Welcome for the first time, ${user.username}! 🎉`);
});
```

Note that `welcomed` is stored in memory so it resets every time your
bot restarts. If you need it to persist across restarts you would need
to save it somewhere outside of memory.

## Summary

- The UserJoined event fires every time someone enters the room
- You get the `user` who joined and their starting `position`
- `position` contains `x`, `y`, `z`, and `facing` coordinates
- This event triggers for every entry, including users returning after leaving
- Use a `Set` to track seen users if you need to distinguish first-timers from returning users
