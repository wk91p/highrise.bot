# bot.webapi.users

The `bot.webapi.users` API fetches public profile data for any Highrise
user. Look up by username or user ID to get their bio, outfit, follower
counts, crew, and more.

## Methods

### get(identifier)

Fetches a user's full profile from the Web API.

```javascript
const user = await bot.webapi.users.get('some_username');

if (user.ok) {
    console.log(`${user.username} has ${user.followers} followers`);
}
```

```javascript
// also works with a user ID
const user = await bot.webapi.users.get(userId);
console.log(user.bio);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `identifier` | `string` | The user's ID or username |

**Returns:** [`UsersResponse`](#usersresponse)

## Complete example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!profile') {
        const target = message.mentions(0) || message.args(0) || user.username;

        const profile = await bot.webapi.users.get(target);

        if (!profile.ok) {
            await bot.message.send(`Could not find user: ${target}`);
            return;
        }

        const lines = [
            `${profile.username}`,
            `Followers: ${profile.followers} | Following: ${profile.following}`,
        ];

        if (profile.bio) {
            lines.push(`Bio: ${profile.bio}`);
        }

        if (profile.crew) {
            lines.push(`Crew: ${profile.crew.name}`);
        }

        if (profile.activeRoom) {
            lines.push(`Currently in: ${profile.activeRoom.name}`);
        }

        await bot.message.send(lines.join('\n'));
        return;
    }

    if (cmd === '!outfit') {
        const target = message.mentions(0) || message.args(0);

        if (!target) {
            await bot.message.send('Usage: !outfit @username');
            return;
        }

        const profile = await bot.webapi.users.get(target);

        if (!profile.ok) {
            await bot.message.send(`Could not find user: ${target}`);
            return;
        }

        const itemNames = profile.outfit.map(i => i.name).join(', ');
        await bot.message.send(`${profile.username} is wearing: ${itemNames}`);
        return;
    }
});
```

## UsersResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;

    id: string;                      // unique user ID
    username: string;                // display name
    bio: string;                     // profile bio
    joinedAt: Date;                  // when the account was created
    lastOnlineIn: Date | null;       // last seen (null if hidden)

    followers: number;               // follower count
    following: number;               // following count
    friends: number;                 // friend count

    outfit: WebApiOutfitItem[];      // items the user is currently wearing
    activeRoom: WebApiActiveRoom | null; // room the user is in (null if hidden)
    crew: WebApiUserCrew | null;     // the user's crew (null if none)

    countryCode: string;             // ISO country code (e.g. 'IQ', 'US')
    voiceEnabled: boolean;           // true if user is 18+ verified
    discordId: string;               // linked Discord account ID

    iconUrl: string;                 // avatar icon URL
    avatarUrl: string;               // full avatar image URL
    avatarSvg: string;               // avatar as a stringified SVG element
}
```

### WebApiOutfitItem

```typescript
{
    item_id: string;         // unique item identifier
    name: string;            // display name of the item
    rarity: string;          // rarity tier (e.g. 'Common', 'Rare', 'Epic')
    active_palette: number;  // currently selected color palette index
}
```

### WebApiActiveRoom

```typescript
{
    id: string;    // room ID
    name: string;  // room display name
}
```

### WebApiUserCrew

```typescript
{
    id: string;    // crew ID
    name: string;  // crew display name
}
```

## Important things to know

**Some fields are `null` by user choice.** If a user hides their active
room or last online status, those fields come back as `null`. Always
check before using them.

**`voiceEnabled` also means age-verified.** Highrise requires users to
verify they are 18+ to enable voice. If `voiceEnabled` is `true`, the
user has completed age verification.

**`identifier` accepts both usernames and IDs.** Either format works,
so you can pass `user.id` from in-room events directly without resolving
the username first.