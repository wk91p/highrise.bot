# Highrise Cluster

`HighriseCluster` allows you to manage multiple bots across multiple rooms from a single process. Each bot is fully independent with its own WebSocket, state, and reconnect logic. All events from every bot are aggregated into a single event emitter with the bot instance prepended as the first argument.

> [!NOTE]
> Memory is minimal. The first bot costs ~750kb, each additional bot costs ~75kb plus the WebSocket connection. A 2GB ram VPS can comfortably handle hundreds of bots in a single cluster process.

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

Adds a bot to the cluster and registers all event listeners. Returns the cluster instance for chaining.

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

### login()

Starts all bots in the cluster by calling `login()` on each one. Always call this last after registering all event listeners.

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

### get(roomId)

Retrieves a specific bot instance by room ID.

```javascript
const bot = cluster.get("roomId1")

if (bot) {
    await bot.message.send("Hello from a specific room!")
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `roomId` | `string` | The room ID of the bot to retrieve |

**Returns:** `Highrise` or `null` if not found.

### getAll()

Returns all bot instances in the cluster.

```javascript
const bots = cluster.getAll()
console.log(`${bots.length} bots running`)
```

**Returns:** `Highrise[]`

### remove(roomId)

Removes a bot from the cluster and disconnects it.

```javascript
cluster.remove("roomId1")
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `roomId` | `string` | The room ID of the bot to remove |

**Returns:** `true` if removed successfully, `false` if not found.

### reconnect(roomId)

Reconnects a specific bot by room ID.

```javascript
cluster.reconnect("roomId1")
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `roomId` | `string` | The room ID of the bot to reconnect |

**Returns:** `true` if reconnected successfully, `false` if not found.

### reconnectAll()

Reconnects all bots in the cluster.

```javascript
cluster.reconnectAll()
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

## Complete example

```javascript
const { HighriseCluster } = require("highrise.bot")

const cluster = new HighriseCluster()

cluster
    .add("token1", "roomId1", { roles: { persistPath: "./room1-roles.json" } })
    .add("token2", "roomId2", { roles: { persistPath: "./room2-roles.json" } })

cluster.once("Ready", async (bot, metadata) => {
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
```

## Important things to know

**Each bot is fully independent.** Roles, state, intervals, and WebSocket connections are all isolated per bot. One bot crashing or reconnecting does not affect others.

**Register listeners before calling `login()`.** The same rule applies as with a single bot — all `cluster.on()` calls must come before `cluster.login()`.

**Each bot can have its own options.** Pass different `options` to each `add()` call to configure bots individually — different role files, different intervals.

**`get(roomId)` returns the bot directly.** You can use it to interact with a specific room at any time:

```javascript
const bot = cluster.get("roomId1")
await bot.message.send("Hello from room 1 only!")
```