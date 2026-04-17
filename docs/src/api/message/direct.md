# bot.direct

The `bot.direct` API handles everything related to private conversations
between your bot and users outside of the room. Unlike whispers which
happen inside a room, direct messages exist across the entire Highrise
platform. A user can message your bot from anywhere and your bot can
reply back to that same conversation thread.

## What lives on bot.direct

```javascript
bot.direct.conversations    // list conversations, leave conversations
bot.direct.messages         // fetch message history from a conversation
bot.direct.send()           // send a message to a conversation
bot.direct.broadcast()      // send the same message to multiple users
bot.direct.inviteRoom()     // invite a user to a room
bot.direct.inviteWorld()    // invite a user to a world
bot.direct.broadcastInvite() // invite multiple users at once
```

This is a larger API than `bot.message` or `bot.whisper`. Take it one
method at a time.

## send()

Sends a direct message to an existing conversation.

```javascript
await bot.direct.send(convId, 'Hey! I got your message.');
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `convId` | `string` | The conversation ID from the Direct event |
| `message` | `string` | The text you want to send |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

### Where to get the conversation ID

The Direct event gives you the conversation object which contains the ID:

```javascript
bot.on('Direct', async (user, message, conversation) => {
    const convId = conversation.id;

    await bot.direct.send(convId, 'Thanks for reaching out!');
});
```

Always use the `conversation.id` from the event itself or save it for later usage. Do not try to
construct one manually.

## broadcast()

Sends the same direct message to multiple users at once.

```javascript
await bot.direct.broadcast(
    ['user_id_1', 'user_id_2', 'user_id_3'],
    'Your daily reward is ready!'
);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userIds` | `string[]` | Array of user IDs (1-100 users) |
| `message` | `string` | The text you want to send |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

### When to use broadcast

Use this when you need to notify multiple users of the same thing.
Examples include event announcements, reward distributions, or system
alerts. Keep the list under 100 users per call.

## inviteRoom()

Invites a user to a specific room through a direct message conversation.

```javascript
await bot.direct.inviteRoom(convId, 'room_id_here');
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `convId` | `string` | The conversation ID |
| `roomId` | `string` | The ID of the room to invite them to |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

## inviteWorld()

Invites a user to a specific 3D world through a direct message
conversation.

```javascript
await bot.direct.inviteWorld(convId, 'world_id_here');
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `convId` | `string` | The conversation ID |
| `worldId` | `string` | The ID of the world to invite them to |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

## broadcastInvite()

Sends the same room or world invite to multiple users.

```javascript
await bot.direct.broadcastInvite(
    ['user_id_1', 'user_id_2'],
    { roomId: 'room_id_here' }
);

// or for a world
await bot.direct.broadcastInvite(
    ['user_id_1', 'user_id_2'],
    { worldId: 'world_id_here' }
);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userIds` | `string[]` | Array of user IDs (1-100 users) |
| `inviteDetails` | `object` | Either `{ roomId: string }` or `{ worldId: string }` |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

## conversations.list()

Fetches a list of the bot's direct message conversations.

```javascript
const inbox = await bot.direct.conversations.list();

// with pagination
const nextPage = await bot.direct.conversations.list(lastId);

// including conversations the bot hasn't joined yet
const withUnjoined = await bot.direct.conversations.list(null, true);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `lastId` | `string \| null` | Cursor for pagination, fetches next 20 conversations |
| `notJoined` | `boolean` | Include conversations the bot hasn't joined (default: false) |

**Returns:** [`GetConversationsResponse`](#getconversationsresponse)

### Pagination

The response includes a `.next()` method for fetching the next page:

```javascript
const inbox = await bot.direct.conversations.list();

if (inbox.ok) {
    console.log(`Found ${inbox.conversations.length} conversations`);

    // fetch the next 20 conversations
    if (inbox.next) {
        const nextPage = await inbox.next();
        console.log(`Next page has ${nextPage.conversations.length} more`);
    }
}
```

## conversations.leave()

Removes the bot from a conversation.

```javascript
await bot.direct.conversations.leave(convId);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `convId` | `string` | The conversation ID to leave |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

## messages.list()

Fetches message history from a specific conversation.

```javascript
const messages = await bot.direct.messages.list(convId);

// with pagination
const olderMessages = await bot.direct.messages.list(convId, lastMessageId);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `convId` | `string` | The conversation ID |
| `lastMessageId` | `string` | Optional cursor for older messages |

**Returns:** [`GetMessagesResponse`](#getmessagesresponse)

### Pagination

Works the same as conversations:

```javascript
const response = await bot.direct.messages.list(convId);

if (response.ok) {
    console.log(`Loaded ${response.messages.length} messages`);

    // fetch older messages
    if (response.next) {
        const older = await response.next();
        console.log(`Found ${older.messages.length} older messages`);
    }
}
```

## Complete example

Here is a Direct handler that responds to commands and uses several
parts of the API:

```javascript
bot.on('Direct', async (user, message, conversation) => {
    const cmd = message.command();
    const convId = conversation.id;

    if (cmd === '!ping') {
        await bot.direct.send(convId, 'Pong! 🏓');
        return;
    }

    if (cmd === '!invite') {
        const roomId = message.args(0);

        if (!roomId) {
            await bot.direct.send(convId, 'Usage: !invite <roomId>');
            return;
        }

        const result = await bot.direct.inviteRoom(convId, roomId);

        if (!result.ok) {
            await bot.direct.send(convId, 'Could not send that invite.');
            return;
        }

        await bot.direct.send(convId, 'Invite sent!');
        return;
    }

    if (cmd === '!broadcast') {
        const text = message.args().join(' ');

        // in a real bot you would get these IDs from somewhere
        const userIds = ['user1', 'user2', 'user3'];

        await bot.direct.broadcast(userIds, text);
        await bot.direct.send(convId, `Broadcast sent to ${userIds.length} users.`);
        return;
    }
});
```

## Response Types

### AcknowledgmentResponse

Returned by `send()`, `broadcast()`, `inviteRoom()`, `inviteWorld()`,
`broadcastInvite()`, and `conversations.leave()`:

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;
}
```

### GetConversationsResponse

Returned by `conversations.list()`:

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;

    conversations: Conversation[];  // array of conversation objects
    notJoined: number;              // count of unjoined conversations
    recentMessage: MessageSummary | null;
    lastId: string | null;          // cursor for next page
    next(): GetConversationsResponse | null;
}
```

### GetMessagesResponse

Returned by `messages.list()`:

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;
    messages: MessageSummary[];     // array of message objects
    recentMessage: MessageSummary | null;
    lastId: string | null;          // cursor for next page
    next(): GetMessagesResponse | null;
}
```

## Important things to know

**Conversation IDs come from the Direct event.** Always use
`conversation.id` from the event handler. Do not guess or construct IDs.

**Broadcast is limited to 100 users per call.** If you need to message
more than 100 users, split them into batches and call `broadcast()`
multiple times.

**Messages over 2000 characters are split automatically.** The same
behavior as `bot.message.send()` applies here.

**Leaving a conversation is permanent.** Once the bot leaves, it cannot
message that user again unless the user starts a new conversation.

**Username is always null in Direct events.** The Direct event only
provides the user ID. If you need the username, you must look it up
separately using `bot.room.users.find()` if they are in the room.

## Summary

- `bot.direct.send(convId, message)` replies to a DM conversation
- `bot.direct.broadcast(userIds, message)` messages up to 100 users at once
- `bot.direct.conversations.list()` fetches the bot's inbox with pagination
- `bot.direct.messages.list(convId)` fetches message history from a conversation
- `bot.direct.inviteRoom()` and `bot.direct.inviteWorld()` send invites
- Always get the conversation ID from the Direct event
- All send methods return `AcknowledgmentResponse`
- List methods return responses with built-in `.next()` pagination