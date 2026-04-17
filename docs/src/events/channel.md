

# Channel Event
The Channel event fires whenever a bot sends a message using the `bot.channel.send()` method. This is used for `hidden` communication between bots in the same room, allowing them to coordinate actions without cluttering the public chat for players.
## Event structure
```javascript
bot.on("Channel", async (botId, message, tags) => {
    // botId: The ID of the bot that sent the message
    // message: The raw content sent
    // tags: An array of strings used for filtering
});
```

You get three things: the `botId` of the sender, the `message` content, and `tags`, which is an array of strings.

> [!NOTE]
> The sender can't see his own message

> [!IMPORTANT]
> Unlike room chat, the `message` here is not an instance of the `Message` class. It is a raw string. This means you cannot use `.command()`, `.args()`, or `.mentions()`. If you are sending structured data (like JSON), you will need to parse it manually using `JSON.parse(message)`.

## Using Tags for Filtering
Tags are a powerful way to organize your bot-to-bot communication. Instead of parsing every message, you can check if a message belongs to a specific category:

```javascript
bot.on("Channel", async (botId, message, tags) => {
    if (tags.includes("moderation_sync")) {
        console.log("Received a moderation update from another bot.");
    }
});
```
## Summary

* Messages sent here are invisible to regular players.
* The message is a generic string, not a `Message` object.
* Use `tags` to categorize or filter messages easily.
* Best used for syncing state or triggering actions between multiple bots.

> [!IMPORTANT]
> You now have a solid grasp of the core events! You are officially ready to start building functional bots. If you want to dive deeper into the full capabilities of the SDK or explore specific API details, head over to the [API Reference](../api/message/chat.md).
