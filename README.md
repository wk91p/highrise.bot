# Highrise.bot

Unofficial JavaScript bot SDK for [Highrise Virtual Reality](https://highrise.game)

**[View Documentation](https://wk91p.github.io/highrise.bot/)**

## Installation

```bash
npm install highrise.bot@latest
```

## Quick start

```javascript
const { Highrise } = require("highrise.bot")

const bot = new Highrise()

bot.once("Ready", async (metadata) => {
    console.log(`Logged in as ${metadata.userId}`)
})

bot.on("Chat", async (user, message) => {
    await bot.message.send(`Hello, ${user.username}!`)
})

bot.login("token", "roomId")
```

## Change Log

### 2.1.1

**Fixed**
- `Message.mentions()` no longer returns usernames with a leading `@`

### 2.1.0

**Changed**
- New method `getAllCommands()` for `CommandManager` class
- Removed `CommandManager` from `bot.command` keeping it exportable only for more flexibility
- Added Roles support for CommandManager for role-based access control
- Exiting process on `doNotReconnect` flag

**Fixed**
- `Conversation` model was incorrectly assigning `isNew` from itself instead of `data.is_new_conversation`

### 2.0.1

> Full rewrite. Not backwards compatible with 1.x.

**Added**
- `EmotesManager` rewrite with all latest emotes
- `EmoteLoop` for looping emotes per user with race condition protection
- Awaiter system for collecting and filtering events with timeouts
- Centralized config and validation system
- Improved connection lifecycle, `reconnect()`, `logout()`, `setToken()`, `setRoomId()`
- Interval state management for centralized cleanup on exit
- WebApi client with pagination support
- `messages` and `conversations` API support pagination using `next()` method in the response
- `HttpClient` exportable class for making HTTP requests to external APIs
- `Validator` exportable class for validating and type-checking values with chainable methods
- `Logger` exportable class for structured and consistent console logging
- `OutfitItem` exportable class for building outfit item objects

**Changed**
- Complete internal rewrite, cleaner and more minimal API
- Event system now validates registered listeners before opening the WebSocket connection
- `EmotesManager` moved from `bot.utils.emotes` to `bot.emotes`
- `CommandManager` is now a standalone exportable class

**Fixed**
- Connection instability and reconnect edge cases
- Race conditions in emote looping
- Memory leaks from uncleared intervals on logout

### 1.3.4

Last stable release of the 1.x series.