# CommandManager

The `CommandManager` Class provides a file-based command system for your bot. It automatically scans a folder for command files, loads them, and registers them. Commands can be triggered by name or alias.

## Setup

```javascript
const { Highrise, CommandManager } = require("highrise.bot")

const bot = new Highrise()

bot.once("Ready", async () => {
    bot.command = new CommandManager("./commands", bot.roles)
})
```

## Command files

Each command is a `.js` file that exports an object with a `name` and an `execute` function.

```javascript
// commands/ping.js
module.exports = {
    name: "ping",
    desc: "Replies with pong",
    aliases: ["p"],
    execute: async (context) => {
        await context.bot.message.send("pong!")
    }
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | The primary name used to trigger the command (e.g. `"ping"`) |
| `execute` | `function` | Yes | The function executed when the command is triggered |
| `aliases` | `string[]` | No | Alternative names that also trigger the command (e.g. `["p"]`) |
| `desc` | `string` | No | Description of what the command does |
| `roles` | `string[]` | No | Roles required to execute the command. If empty, everyone can use it. |

## Methods

### handle(commandName, context)

Looks up and executes a command by name or alias.

```javascript
bot.on("Chat", async (user, message) => {
    const cmd = message.command()
    if (!cmd) return

    bot.command.handle(cmd, { bot, user, message })
})
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `commandName` | `string` | The name or alias of the command to execute |
| `context` | `any` | The context passed to the command's `execute` function |

**Returns:** `true` if the command was found and executed, `false` if not found or user lacks access.

### register(module)

Manually registers a command at runtime without needing a file.

```javascript
bot.command.register({
    name: "hello",
    desc: "Greets the user",
    execute: async (context) => {
        await context.bot.message.send(`Hello, ${context.user.username}!`)
    }
})
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `module` | `Command` | The command object to register |

**Returns:** `true` if registered successfully, `false` if validation failed or a name collision was detected.

### unregister(name)

Removes a command and all its aliases by name.

```javascript
bot.command.unregister("ping")
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | The primary name or alias of the command to remove |

**Returns:** `true` if removed successfully, `false` if not found.

### init()

Rescans and reloads all command files from the folder. Useful if you add new files at runtime without restarting the bot.

```javascript
bot.command.init()
```

**Returns:** `void`

## Complete example

```javascript
// commands/ping.js
module.exports = {
    name: "ping",
    aliases: ["p"],
    desc: "Replies with pong",
    execute: async ({ bot }) => {
        await bot.message.send("pong!")
    }
}

// commands/kick.js
module.exports = {
    name: "kick",
    desc: "Kicks a user from the room",
    roles: ["mod", "owner"],
    execute: async ({ bot, message }) => {
        const target = message.args(0)
        if (!target) return bot.message.send("Usage: !kick <userId>")
        await bot.player.kick(target)
    }
}
```

```javascript
// index.js
const { Highrise, CommandManager } = require("highrise.bot")

const bot = new Highrise()

bot.once("Ready", async () => {
    bot.command = new CommandManager("./commands", bot.roles)
})

bot.on("Chat", async (user, message) => {
    const cmd = message.command()
    if (!cmd) return

    const handled = bot.command.handle(cmd, { bot, user, message })

    if (!handled) {
        await bot.message.send(`Unknown command: ${cmd}`)
    }
})

bot.login("token", "roomId")
```

## Important things to know

**Files are loaded automatically on startup.** Any `.js` file inside the `folderPath` (including subfolders) is scanned and registered when the bot starts.

**Name collisions are skipped with a warning.** If two commands share the same name or alias, the second one is skipped and an error is logged.

**Commands with `roles` are access-controlled.** If a command has a `roles` array, only users with at least one of those roles can execute it. `handle` returns `false` silently if the user lacks access.

```javascript
// only mod and owner can use this command
module.exports = {
    name: "ban",
    roles: ["mod", "owner"],
    execute: async ({ bot, user }) => { ... }
}
```

**`context` is whatever you pass.** The SDK does not define a context shape, you decide what to include when calling `handle`. Pass anything your commands need:

```javascript
bot.command.handle(cmd, { bot, user, message, roles: bot.roles })
```

**`init()` clears the module cache on every reload.** This means changes to command files are picked up without restarting the bot, but shared state inside command files will be reset.