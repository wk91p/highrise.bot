# Highrise Cluster

`HighriseCluster` allows you to manage multiple bots across multiple rooms from a single process. Each bot is fully independent with its own WebSocket, state, and reconnect logic. All events from every bot are aggregated into a single event emitter with the bot instance prepended as the first argument.

> [!NOTE]
> Memory is minimal. The first bot costs ~750kb, each additional bot costs ~447kb with the WebSocket connection. A 2GB ram VPS can comfortably handle hundreds of bots in a single cluster process.

## Setup

```javascript
const { HighriseCluster } = require("highrise.bot")

const cluster = new HighriseCluster()

cluster
    .add("token1", "roomId1")
    .add("token2", "roomId2")
    .add("token3", "roomId3")

cluster.on("Ready", async (bot, metadata) => {
    console.log(`${metadata.userId} connected`)
})

cluster.on("Chat", async (bot, user, message) => {
    await bot.message.send(`Hello ${user.username}!`)
})

cluster.login()
```

## Methods

### add(token, roomId, options)

Adds a bot to the cluster, indexed by both token and room ID, and registers all event listeners. Returns the cluster instance for chaining.

```javascript
cluster
    .add("token", "roomId")
    // with options
    .add("token", "roomId", {
    roles: {
        persistPath: "./roles.json"
    }
})

```

| Parameter | Type | Description |
|-----------|------|-------------|
| `token` | `string` | The authentication token for the bot |
| `roomId` | `string` | The room ID the bot will connect to |
| `options` | `LoginOptions` | Optional configuration options for the bot |

**Returns:** `this` for chaining.

> [!NOTE]
> Multiple bots can share the same room. Adding a bot with a token that already exists in the cluster is skipped with a warning. If the cluster has already been started with `login()`, calling `add()` afterward wires and logs in the new bot immediately.

### login()

Starts all bots in the cluster by wiring event forwarding and calling `login()` on each one. Always call this last after registering all event listeners.

```javascript
cluster.login()
```

**Returns:** `this` for chaining.

### logout()

Disconnects all bots in the cluster.

```javascript
cluster.logout()
```

**Returns:** `this` for chaining.

### getByToken(token)

Retrieves a specific bot instance by its authentication token.

```javascript
const bot = cluster.getByToken("token1")

if (bot) {
    await bot.message.send("Hello from a specific bot!")
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `token` | `string` | The token of the bot to retrieve |

**Returns:** `Highrise` or `null` if not found.

### getByRoom(roomId)

Retrieves bot(s) by room ID.

```javascript
const bot = cluster.getByRoom("roomId1")

// if multiple bots share the room, an array is returned instead
if (Array.isArray(bot)) {
    for (const b of bot) await b.message.send("Hello from this room!")
} else if (bot) {
    await bot.message.send("Hello from this room!")
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `roomId` | `string` | The room ID to look up |

**Returns:** A single `Highrise` if only one bot exists in the room, `Highrise[]` if multiple bots share the room, or `null` if none found.

### getAll()

Returns all bot instances in the cluster.

```javascript
const bots = cluster.getAll()
console.log(`${bots.length} bots running`)
```

**Returns:** `Highrise[]`

### removeByToken(token)

Removes a bot from the cluster by its authentication token and disconnects it.

```javascript
cluster.removeByToken("token1")
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `token` | `string` | The token of the bot to remove |

**Returns:** `true` if removed successfully, `false` if not found.

### removeByRoom(roomId)

Removes all bots in a room from the cluster and disconnects them.

```javascript
cluster.removeByRoom("roomId1")
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `roomId` | `string` | The room ID to remove all bots from |

**Returns:** `true` if any bots were removed, `false` if none found.

### reconnectByToken(token)

Reconnects a specific bot by its authentication token.

```javascript
cluster.reconnectByToken("token1")
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `token` | `string` | The token of the bot to reconnect |

**Returns:** `true` if reconnected successfully, `false` if not found.

### reconnectByRoom(roomId)

Reconnects all bots in a specific room.

```javascript
cluster.reconnectByRoom("roomId1")
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `roomId` | `string` | The room ID to reconnect all bots in |

**Returns:** `true` if any bots were reconnected, `false` if none found.

### reconnectAll()

Reconnects all bots in the cluster.

```javascript
cluster.reconnectAll()
```

**Returns:** `void`

### destroyAll()

Destroys and removes all bots in the cluster, calling `destroy()` on each one. Automatically called on `SIGINT` and `SIGTERM`.

```javascript
cluster.destroyAll()
```

**Returns:** `void`

### size

Returns the number of bots currently in the cluster.

```javascript
console.log(`${cluster.size} bots running`)
```

**Returns:** `number`

## Events

All events from every bot are forwarded to the cluster with the bot instance prepended as the first argument.

```javascript
cluster.on("Chat", async (bot, user, message) => {})
cluster.on("UserJoined", async (bot, user, position) => {})
cluster.on("UserLeft", async (bot, user) => {})
cluster.on("Tip", async (bot, sender, receiver, currency) => {})
cluster.on("Ready", async (bot, metadata) => {})
cluster.on("Moderation", async (bot, moderator, target, action) => {})
cluster.on("Movement", async (bot, user, position, anchor) => {})
cluster.on("Direct", async (bot, user, message, conversation) => {})
cluster.on("Channel", async (bot, botId, message, tags) => {})
```

> [!WARNING]
> Register all `cluster.on()` listeners before calling `cluster.login()`. Bots already connected will not receive events for listeners registered afterward, since the event subscription list is fixed at connection time via the WebSocket URL. Bots added via `cluster.add()` after `login()` will correctly include all currently registered events.

## Complete example

```javascript
const { HighriseCluster } = require("highrise.bot")

const cluster = new HighriseCluster()

cluster
    .add("token1", "roomId1", { roles: { persistPath: "./room1-roles.json" } })
    .add("token2", "roomId2", { roles: { persistPath: "./room2-roles.json" } })

cluster.on("Ready", async (bot, metadata) => {
    console.log(`${metadata.userId} is online in ${bot.metadata.room.roomName}`)
})

cluster.on("Chat", async (bot, user, message) => {
    const cmd = message.command()
    if (!cmd) return

    if (cmd === "!room") {
        await bot.message.send(`You are in ${bot.metadata.room.roomName}`)
        return
    }

    if (cmd === "!bots") {
        await bot.message.send(`${cluster.size} bots are running`)
        return
    }
})

cluster.on("UserJoined", async (bot, user, position) => {
    await bot.message.send(`Welcome ${user.username}!`)
})

cluster.login()

// add a bot dynamically after the cluster has started
cluster.add("token3", "roomId3")
```

## Important things to know

**Each bot is fully independent.** Roles, state, intervals, and WebSocket connections are all isolated per bot. One bot crashing or reconnecting does not affect others.

**Bots are indexed by both token and room ID.** Use `getByToken()` when you need a guaranteed single bot, or `getByRoom()` when a room might have multiple bots sharing it.

**Multiple bots can share the same room.** Unlike earlier versions, adding a second bot to a room already in use does not overwrite the first, both remain active and `getByRoom()` returns an array when this happens.

**Bots can be added after `login()`.** Calling `cluster.add()` after the cluster has already started wires event forwarding and logs the new bot in immediately, useful for dynamically scaling bots based on room population.

**Each bot can have its own options.** Pass different `options` to each `add()` call to configure bots individually. different role files, different intervals.