# bot.webapi.rooms

The `bot.webapi.rooms` API fetches room data from the Highrise Web API.
Get details about a specific room or browse rooms by name and owner.

## Methods

### get(roomId)

Fetches full details for a specific room.

```javascript
const room = await bot.webapi.rooms.get(bot.credential.roomId);

if (room.ok) {
    console.log(`${room.name} — ${room.playersOnline} online`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `roomId` | `string` | The room's unique ID |

**Returns:** [`RoomResponse`](#roomresponse)

### list(params)

Fetches a filtered, paginated list of rooms. Defaults to 20 rooms in
descending order if no params are passed.

```javascript
// default — 20 rooms descending
const rooms = await bot.webapi.rooms.list();

// only 5 rooms
const rooms = await bot.webapi.rooms.list({ limit: 5 });

// rooms owned by a specific user
const rooms = await bot.webapi.rooms.list({ ownerId: userId });

// search by name
const rooms = await bot.webapi.rooms.list({ roomName: 'party' });
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | `number` | Maximum number of rooms to return |
| `sortOrder` | `"asc"` \| `"desc"` | Order of results |
| `roomName` | `string` | Filter rooms by name |
| `ownerId` | `string` | Filter rooms by owner ID |
| `startsAfter` | `string` | Return rooms after this room ID (pagination) |
| `endsBefore` | `string` | Return rooms before this room ID (pagination) |

**Returns:** [`RoomsResponse`](#roomsresponse)

## Complete example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!roominfo') {
        const room = await bot.webapi.rooms.get(bot.credential.roomId);

        if (!room.ok) {
            await bot.message.send('Could not fetch room info.');
            return;
        }

        await bot.message.send(
            `${room.name}\nPlayers online: ${room.playersOnline}\nCategory: ${room.category}`
        );
        return;
    }

    if (cmd === '!myrooms') {
        const profile = await bot.webapi.users.get(user.username);
        if (!profile.ok) return;

        const result = await bot.webapi.rooms.list({ ownerId: profile.id, limit: 5 });

        if (!result.ok || result.rooms.length === 0) {
            await bot.message.send('No rooms found.');
            return;
        }

        const names = result.rooms.map(r => r.name).join(', ');
        await bot.message.send(`Your rooms: ${names}`);
        return;
    }
});
```

### Paginating through all rooms

```javascript
let page = await bot.webapi.rooms.list();

while (page) {
    for (const room of page.rooms) {
        console.log(room.name);
    }

    await bot.utils.sleep(3000) // wait 3 sec to avoid rate limit
    page = page.next ? await page.next() : null;
}
```

## RoomResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;

    id: string;                    // unique room ID
    name: string;                  // display name
    createdAt: Date;               // UTC timestamp of creation
    accessPolicy: string;          // who can enter the room
    category: string;              // room category
    ownerId: string;               // user ID of the room owner
    locale: string[];              // locale codes (usually one)
    isHome: boolean;               // whether this is the owner's home room
    playersOnline: number;         // current player count
    moderatorIds: string[];        // user IDs with moderator privileges
    designerIds: string[];         // user IDs with designer privileges
    description: string | null;    // room description
    crewId: string | null;         // associated crew ID, if any
    thumbnailUrl: string | null;   // room thumbnail image URL
    bannerUrl: string | null;      // room banner image URL
}
```

## RoomsResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;

    rooms: Room[];       // list of rooms
    total: number;       // total rooms available
    firstId: string;
    lastId: string;
    next(): Promise<RoomsResponse> | null;
}
```

### Room

```typescript
{
    id: string;                    // unique room ID
    name: string;                  // display name
    createdAt: Date;               // UTC timestamp of creation
    accessPolicy: string;          // who can enter the room
    category: string;              // room category
    ownerId: string;               // user ID of the room owner
    locale: string[];              // locale codes (usually one)
    isHome: boolean;               // whether this is the owner's home room
    moderatorIds: string[];        // user IDs with moderator privileges
    designerIds: string[];         // user IDs with designer privileges
    description: string | null;    // room description
}
```

## Important things to know

**`list()` works without parameters.** Calling it with no arguments
returns 20 rooms in descending order by default.

**Use `ownerId` to find all rooms a user owns.** Combine with
`bot.webapi.users.get()` to resolve a username to an ID first.

**`next()` returns `null` when there are no more results.** Always
check before calling it to avoid errors.

**`playersOnline` and image URLs are only on `RoomResponse`.** The
`Room` objects inside `RoomsResponse` are lighter and do not include
`playersOnline`, `thumbnailUrl`, or `bannerUrl`. Use `get()` for full
details on a specific room.