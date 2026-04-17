# Installation

Let's get highrise.bot installed and your project ready. This should take less than five minutes.

## Requirements

- Node.js 18 or higher
- npm (comes with Node.js automatically)

Not sure if you have Node.js? Open your terminal and run:

```bash
node --version
```

If you see a version number like `v20.11.0` you are good to go. If you
get an error, head over to [nodejs.org](https://nodejs.org/en/download)
and download the LTS version.

## Setting up your project

Before installing anything, you need a folder for your bot to live in.
Open your terminal and run these commands one by one:

```bash
mkdir my-bot
cd my-bot
npm init -y
```

Here is what each one does:

`mkdir my-bot` creates a new folder called `my-bot`. You can name it
whatever you want.

`cd my-bot` moves you into that folder.

`npm init -y` sets up a `package.json` file which keeps track of your
project and its dependencies.

## Installing highrise.bot

Now install the SDK:

```bash
npm install highrise.bot
```
## Using the starter template

highrise.bot comes with a built-in command that sets up everything for
you automatically. Run this inside your project folder:

```bash
npx highrise-init
```

After running it you will see something like this:

```
[highrise.bot] Initializing project...
  + created index.js
  + created .env
  + updated package.json scripts

--- Setup Complete ---
1. Run: npm install dotenv
2. Add your credentials to the .env file
3. Start your bot with: npm start
```

Two files will be created for you:

`index.js` is your bot file. It already has comments explaining every
part of it so you know exactly what is going on.

`.env` is where you will put your bot token and room ID. We will cover
this on the next page.

Follow the steps it prints and you will be ready to go.

## Manual setup

If you prefer to set things up yourself, create an `index.js` file in
your project folder and paste this in:

```javascript
const { Highrise } = require('highrise.bot');
require('dotenv').config();

const bot = new Highrise();

bot.once('Ready', async (metadata) => {
    console.log(`Online in ${metadata.room.room_name}`);
});

bot.login(process.env.BOT_TOKEN, process.env.ROOM_ID);
```

You will also need dotenv to read your credentials from the `.env` file:

```bash
npm install dotenv
```

Do not worry too much about what all of this means right now. We will go
through every line in the Quick Start page.

Next up, let's get your bot token and room ID configured so your bot can
actually connect.