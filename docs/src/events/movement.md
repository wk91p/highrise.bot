# Movement Event

The Movement event fires every time a user taps somewhere in the room to
walk there, or taps a piece of furniture to sit on it. Every tap is a
movement event. In an active room with many users this event fires
constantly, which makes it one of the most important events to handle
carefully.

## Event structure

```javascript
bot.on('Movement', async (user, position, anchor) => {

});
```

You get three things: the `user` who moved, their new `position` if they
walked somewhere, and their `anchor` if they sat down. Only one of
`position` or `anchor` will have a value at any time. The other will
always be `null`.

## The user object

```javascript
bot.on('Movement', async (user, position, anchor) => {
    console.log(user.id)        // their unique Highrise user ID
    console.log(user.username)  // their display name
});
```

## The position object

When a user taps the floor to walk somewhere, `position` has a value and
`anchor` is `null`:

```javascript
bot.on('Movement', async (user, position, anchor) => {
    if (position) {
        console.log(
            position.x       // left/right
            position.y       // height
            position.z       // forward/back
            position.facing  // "FrontRight", "FrontLeft", "BackRight", "BackLeft"
        )  
    }
});
```

## The anchor object

When a user taps a chair, couch, or any sitting furniture, `anchor` has
a value and `position` is `null`:

```javascript
bot.on('Movement', async (user, position, anchor) => {
    if (anchor) {
        console.log(
            anchor.entity_id  // the ID of the furniture they sat on
            anchor.anchor_ix  // which specific seat on that furniture
        )
    }
});
```

## Checking which one you have

Since only one will ever be set, a simple check is enough:

```javascript
bot.on('Movement', async (user, position, anchor) => {
    if (position) {
        // user tapped the floor and is walking
    } else {
        // user tapped furniture and is sitting
        // anchor is guaranteed to have a value here
    }
});
```

## A simple example ( 20x20 Room )

let's create a **VIP Lounge**. It uses a simple **if/else if** structure to give users different statuses based on where they are in the room.

```javascript
bot.on('Movement', async (user, position) => {
    // 1. Safety check: If the user is sitting, we can't get their position
    if (!position) return;

    // 2. Define our area using simple coordinate checks
    const isInVIPLounge = position.x > 15 && position.z > 15;

    // 3. Logic: Check where the user is and respond
    if (isInVIPLounge) {
        // This only triggers if the user is in the far corner
        await bot.whisper.send(user.id, "Welcome to the VIP Lounge!");
    } else {
        // This triggers everywhere else (the "General" area)
        await bot.whisper.send(user.id, "You are walking through the main lobby.");
    }
});
```

## Important things to know

**This event fires a lot.** In a room with 20+ active users all moving
around, this event can fire hundreds of times per minute. Keep your
handler as fast as possible. If the first thing you do is check a
condition and return early, do that check before anything else so the
expensive code never runs unnecessarily:

```javascript
bot.on('Movement', async (user, position, anchor) => {
    // cheap check first — exit immediately if we do not care about this user
    if (!trackedUsers.has(user.id)) return;

    // only reaches here for users we actually care about
    // do the expensive work now
});
```

**Do not make API requests inside this event without a guard.** Calling
`bot.room.users.get()` or any other request every time someone moves
will make your bot generate a huge number of requests very quickly.
Always narrow down with a cheap check before making any network call.

## Summary

- The Movement event fires when a user taps the floor to walk or taps furniture to sit
- You get `user`, `position`, and `anchor` objects, but only one of the latter two will have a value
- `position` includes `x`, `y`, `z`, and `facing` for walking users
- `anchor` includes `entity_id` and `anchor_ix` for sitting users
- This event fires very frequently, so always use early returns to optimize performance
- Never make API requests inside this handler without a strict guard condition
- Clean up tracking data in the `UserLeft` event to prevent memory leaks
