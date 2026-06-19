# Emote Event

Emitted when the bot performs an emote on a user or when a user performs an emote in the room.

> [!NOTE]
> This event changed over updates. Behavior may be inconsistent.

## Usage

```javascript
bot.on("Emote", async (user, emoteId, receiver) => {
    console.log(`${user.username} performed emote ${emoteId} on ${receiver.username}`)
})
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `user` | `User` | The user who performed the emote |
| `emoteId` | `string` | The unique identifier of the emote (e.g. `"sit-idle-cute"`) |
| `receiver` | `Receiver` | The user who received the emote |