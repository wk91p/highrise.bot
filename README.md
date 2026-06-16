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