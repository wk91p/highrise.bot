# Requests and Responses

Every time your bot does something active, sending a message,
teleporting a user, fetching who is in the room, it sends a request to
Highrise and waits for a response. This page explains how that works and
what you get back.

## Sending a request

Requests are simple. You call a method on `bot` and wait for it:

```javascript
await bot.message.send('Hello!');
```

That single line sends a message to the room. Under the hood it packages
the request, sends it over the WebSocket connection, waits for Highrise
to confirm it was received, and gives you back the result.

The `await` is important. Without it your code moves on before the
request finishes and you will not have the response.

## What comes back

Every request returns a response object. No matter what you asked for,
that object always has two things on it:

```javascript
const result = await bot.message.send('Hello!');

result.ok     // true if it worked, false if it did not
result.error  // null if it worked, a string explaining what went wrong if it did not
```

And this method:

```javascript
result.hasError()  // returns true if there is an error
```

This means you never have to worry about your bot crashing from a failed
request. If something goes wrong, the error is captured and handed to
you cleanly instead of blowing up your code.

## Checking if it worked

The simplest pattern is checking `ok` before doing anything with the
result:

```javascript
const result = await bot.message.send('Hello!');

if (!result.ok) {
    log.warn('Chat', `Message failed: ${result.error}`);
    return;
}

// message sent successfully, continue
```

You do not have to check every single response. For things like a
welcome message, you might not care if it occasionally fails. But for
anything important, purchases, moderation actions, fetching data you
need, it is worth checking.

## Responses with data

Some requests give you back more than just `ok` and `error`. When you
ask Highrise for information, the response includes the data you asked
for along with methods to work with it:

```javascript
const wallet = await bot.inventory.wallet.get();

wallet.ok          // true if it worked
wallet.error       // null if it worked
wallet.gold        // how much gold the bot has
wallet.boostToken  // boost tokens
wallet.voiceToken  // voice tokens
```

```javascript
const room = await bot.room.users.get();

room.ok       // true if it worked
room.error    // null if it worked
room.users    // array of users and their positions
room.count()  // how many users are in the room
room.has('Unfairly')         // is this user in the room
room.find('Unfairly')        // get the full user object
room.position('Unfairly')    // where are they standing
```

Notice that `room` has both properties like `room.users` and methods
like `room.count()` and `room.has()`. The response object is not just a
container for data. It knows how to answer the most common questions
about that data so you do not have to write the logic yourself.

Also notice that `room.has('Unfairly')` and `room.position('Unfairly')` accept
either a username or a user ID. You pass in whatever you have and the
response figures out the rest.

## Shorthand methods

For common lookups you do not need to call `.get()` first and then call
a method on the result. You can call the method directly:

```javascript
// these two do exactly the same thing
const room = await bot.room.users.get();
const count = room.count();

// shorthand
const count = await bot.room.users.count();
```

```javascript
// same thing for checking presence
const room = await bot.room.users.get();
const inRoom = room.has('Unfairly');

// shorthand
const inRoom = await bot.room.users.has('Unfairly');
```

Use the shorthand when you only need one piece of information. Use
`.get()` when you need multiple pieces so you are not making the same
network request several times.

## Timeouts

If Highrise does not respond to a request within 10 seconds, the request
times out automatically:

```javascript
const result = await bot.message.send('Hello!');

// if it timed out
result.ok     // false
result.error  // "Request timed out after 10 seconds"
```

You do not need to set up any timers yourself. The SDK handles this for
you.

## Acknowledgment responses

Some requests do not give you any meaningful data back. Kicking a user,
sending an emote, teleporting someone. For these you get back a simple
acknowledgment that tells you whether it worked:

```javascript
const result = await bot.room.moderation.kick(userId);

result.ok     // true if the kick went through
result.error  // what went wrong if it did not
```

Every request follows the same pattern. Once you understand it once you
understand it everywhere.