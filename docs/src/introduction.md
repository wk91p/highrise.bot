<p align="center">
  <img src="highrise.bot-logo.png" alt="highrise.bot logo" width="320">
  <br>
  
  <img alt="NPM Downloads" src="https://img.shields.io/npm/d18m/highrise.bot">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/highrise.bot">
  <img alt="NPM Type Definitions" src="https://img.shields.io/npm/types/highrise.bot">
  <img alt="NPM License" src="https://img.shields.io/npm/l/highrise.bot">

</p>

Only two Highrise JavaScript libraries exist: our `highrise.bot` and [highrise.sdk.dev](https://www.npmjs.com/package/highrise.sdk) by [Sphinix](https://www.npmjs.com/~phinix)

Sphinix's SDK is the first JS library for the platform and it's a great lightweight SDK for developers who want low-level control. `highrise.bot` was built with a goal: **Developer Experience.** also provides a complete framework. Every action has a clean API, responses are fully structured and ready to use with bulit-in methods. You spend your time building features.

All it take is `3 Lines` to spawn a bot in your room:

```javascript
const { Highrise } = require("highrise.bot")

const bot = new Highrise()

bot.login("BOT_TOKEN", "ROOM_ID");
```
# What you need

Three things before we get started.

**Node.js 18 or higher**

This is the runtime that executes your bot code. Head to
[nodejs.org](https://nodejs.org/en/download) and download the LTS
version. LTS stands for Long-Term Support which means it is the most
stable and thoroughly tested version available. If you already have
Node.js installed, open your terminal and run `node --version` to check.
Anything 18 or above is fine.

**A bot token**

This is the key that proves to Highrise that your bot is allowed to
connect. Go to the [Highrise developer portal](https://create.highrise.game/dashboard/credentials/api-keys),
create a new bot, give it a name you will recognize, generate a new token from the 3 dots next to it, and copy the
token it generates. Keep it somewhere safe because you will need it in
a moment.

**Your room ID**

This tells the bot which room to live in. Open the
[Rooms tab](https://create.highrise.game/dashboard/creations?type=rooms)
in the developer portal, find the room you want, click the three dots
next to it, and copy the room ID.

Got all three? Head to [Installation](./getting-started/installation.md)
and let's get your bot running.