# Configuration

Your bot needs two things to connect to Highrise: a bot token and a room
ID. This page will show you where to get them and how to set them up
properly.

## The .env file

If you used `npx highrise-init`, a `.env` file was already created for
you in your project folder. Open it and you will see something like this:

```
BOT_TOKEN=your_bot_token_here
ROOM_ID=your_room_id_here
```

Replace the placeholder values with your actual credentials. We will get
those in a moment.

If you set things up manually, create a new file called `.env` in your
project folder and paste the lines above into it.

## Getting your bot token

Your bot token is what tells Highrise that your bot is allowed to
connect. Think of it like a password for your bot.

1. Go to the [Highrise developer portal](https://create.highrise.game/dashboard/credentials/api-keys)
2. Sign in with your Highrise account
3. Click **Create API Key**
4. Give it a name so you can recognize it later
5. Copy the token it generates

Now paste it into your `.env` file:

```
BOT_TOKEN=paste_your_token_here
```

> [!IMPORTANT]
> Your token is sensitive. Anyone who has it can control your bot and
> act as it in any room. Never share it, never post it in a Discord
> server, and never commit it to GitHub.

## Getting your room ID

Your room ID tells the bot which room to connect to.

1. Go to the [Rooms tab](https://create.highrise.game/dashboard/creations?type=rooms) in the developer portal
2. Click the 3 dots beside the room you want your bot to connect to and click Copy ID

Paste it into your `.env` file:

```
ROOM_ID=paste_your_room_id_here
```

Your `.env` file should now look something like this:

```
BOT_TOKEN=64_character_string_here
ROOM_ID=24_character_string_here
```

## Keeping your credentials safe

There is one more thing you need to do before moving on. You never want
your `.env` file to end up on GitHub because it contains sensitive
information. Create a file called `.gitignore` in your project folder
and add this to it:

```
node_modules
.env
```

This tells Git to ignore both your credentials and your installed
packages when you push your code. If you are not using Git yet, you can
skip this step for now but it is a good habit to get into early.

## Verifying everything works

Let's make sure your credentials are set up correctly. Run your bot:

```bash
npm start
```

If everything is good, you will see something like this in your terminal:

```
[Highrise] │ 12:00:00 │ [INFO] │ Connected to Highrise Bot Server
[Highrise] │ 12:00:01 │ [INFO] │ Now online in ****
```

If you see an error instead, here are the most common causes:

Extra spaces around the `=` in your `.env` file. It should be
`BOT_TOKEN=abc` not `BOT_TOKEN = abc`, Also do not use quotes (`" "`) or spaces. Just put the raw string after the equals sign.

The token or room ID was copied incorrectly. Try copying it again.

Your bot token was not created properly. Go back to the [Highrise developer portal](https://create.highrise.game/dashboard/credentials/api-keys)
and check.

Once your bot is online, let's write some actual code!