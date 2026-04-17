# User Left Event

The UserLeft event fires every time someone leaves your Highrise room.
It is simpler than UserJoined because you only get the user object.
There is no position because they are already gone by the time the
event fires.

## Event structure

```javascript
bot.on('UserLeft', async (user) => {

});
```

## The user object

```javascript
bot.on('UserLeft', async (user) => {
    user.id        // their unique Highrise user ID
    user.username  // their display name
});
```

That is all you get. Just the user. No position, no reason, no
additional context. They left and this is who it was.

## A complete example

Here is a realistic UserLeft handler that tracks session time and cleans
up any data stored for that user:

```javascript
const joinTimes = new Map();

bot.on('UserJoined', async (user, position) => {
    // record when they joined so we can calculate how long they stayed
    joinTimes.set(user.id, Date.now()); // storing timestamp the moment they joined
    await bot.message.send(`Welcome, ${user.username}!`);
});

bot.on('UserLeft', async (user) => {
    // calculate how long they were in the room
    const joinedAt = joinTimes.get(user.id);

    if (joinedAt) {
        // since joinedAt is less than current one we will get the diff
        const ms = Date.now() - joinedAt;
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);

        // log their session time in the terminal
        log.info('Session', `${user.username} was here for ${minutes}m ${seconds}s`);

        // clean up so the Map does not grow forever as users come and go
        joinTimes.delete(user.id);
    }
});
```

## Important things to know

Be careful with goodbye messages in busy rooms. If the UserJoined event
can flood the chat with welcome messages, UserLeft can do the same with
goodbyes. In an active room with users constantly coming and going, a
goodbye message for every single person gets annoying fast. It works
well in smaller quieter rooms, but in busy rooms it is better to skip
it or only say goodbye to specific users you care about.

Always clean up data when a user leaves. If your bot stores anything
per-user like cooldowns, warnings, or session data, the UserLeft event
is the right place to delete it so your Maps and objects do not grow
indefinitely throughout the day.

## Summary

- The UserLeft event fires every time someone leaves the room
- You only get the `user` object containing their `id` and `username`
- No position data is provided for this event
- Common uses include logging session time and sending conditional goodbye messages
- Use this event to clean up stored user data to prevent memory growth
- Pair it with the UserJoined event to maintain an accurate list of current room occupants
