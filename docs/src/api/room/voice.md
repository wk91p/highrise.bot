# await bot.room.voice

The `await bot.room.voice` API manages voice chat in the room. Check who is
currently speaking, invite users to speak, and remove users from the
voice chat.

## Methods

### check()

Gets the current voice chat status and active speakers.

```javascript
const voice = await bot.room.voice.check();

if (voice.ok) {
    console.log(`Seconds left: ${voice.secondsLeft}`);
    console.log(`Speakers: ${voice.speakers.join(', ')}`);
}
```

**Returns:** [`CheckVoiceChatResponse`](#checkvoicechatresponse)

### invite(userId)

Invites a user to speak in the voice chat.

```javascript
const result = await bot.room.voice.invite(userId);

if (result.ok) {
    await bot.whisper.send(userId, 'You can now speak in voice chat');
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The ID of the user to invite |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

### remove(userId)

Removes a user from speaking in the voice chat.

```javascript
const result = await bot.room.voice.remove(userId);

if (result.ok) {
    await bot.whisper.send(userId, 'You have been removed from voice chat');
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The ID of the user to remove |

**Returns:** [`AcknowledgmentResponse`](#acknowledgmentresponse)

## Complete example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!voice') {
        const voice = await bot.room.voice.check();

        if (!voice.ok) {
            await bot.message.send('Could not check voice status.');
            return;
        }

        if (voice.speakers.length === 0) {
            await bot.message.send('No one is speaking right now.');
        } else {
            await bot.message.send(`Speakers: ${voice.speakers.length} users`);
        }

        await bot.message.send(`Voice time remaining: ${voice.secondsLeft} seconds`);
        return;
    }

    if (cmd === '!speak') {
        const result = await bot.room.voice.invite(user.id);

        if (!result.ok) {
            await bot.whisper.send(user.id, 'Could not invite you to speak.');
            return;
        }

        await bot.whisper.send(user.id, 'You can now speak in voice chat!');
        return;
    }
});

// Auto-invite moderators to voice
bot.on('UserJoined',async (user) => {
    const isMod = await bot.room.privilege.isModerator(user.id);

    if (isMod.value) {
        await bot.room.voice.invite(user.id);
    }
});
```

## CheckVoiceChatResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;

    secondsLeft: number;     // time remaining in current voice session
    speakers: string[];      // array of user IDs currently speaking
}
```

## AcknowledgmentResponse

Returned by `invite()` and `remove()`:

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;
}
```

## Important things to know

**Voice chat requires a live chat enabled** Rooms have a limited amount of
voice time. When the time runs out, voice chat ends until more extends.

**Only moderators and the room owner can invite speakers.** Your bot
must have appropriate privileges to use `invite()` and `remove()`.

**`secondsLeft` is the time until voice chat ends.** When this reaches
zero, all speakers are removed and new invitations will fail until more
voice time is added.

**`speakers` contains user IDs, not usernames.** If you need usernames,
use `bot.room.users.username()` to look them up.