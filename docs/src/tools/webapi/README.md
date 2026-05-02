# bot.webapi

The `bot.webapi` API gives your bot access to the Highrise Web API,
public data about users, rooms, posts, items, and grabs. This is
separate from the in-room bot API. It is useful for looking up profile
data, browsing items, or fetching room details without needing the user
to be in the room.

## What lives on bot.webapi

```javascript
bot.webapi.users    // fetch user profiles by ID or username
bot.webapi.rooms    // fetch room details and browse rooms
bot.webapi.posts    // fetch user posts and browse the feed
bot.webapi.items    // fetch item details, search, and browse the catalog
bot.webapi.grabs    // fetch grab details and browse active grabs
```

## When to use each

| API | Use when you need to... |
|-----|-------------------------|
| `bot.webapi.users` | Look up a user's profile, bio, outfit, crew, or follower count |
| `bot.webapi.rooms` | Get room details, owner, moderators, or browse rooms by name |
| `bot.webapi.posts` | Fetch a user's posts or browse the public feed |
| `bot.webapi.items` | Look up item details, search by name, or browse by category and rarity |
| `bot.webapi.grabs` | Fetch active grabs and their rewards |

## Quick examples

### Look up a user
```javascript
const user = await bot.webapi.users.get('username_or_id');
console.log(user.username, user.followers);
```

### Get a room
```javascript
const room = await bot.webapi.rooms.get(bot.credential.roomId);
console.log(room.name, room.playersOnline);
```

### Search for an item
```javascript
const results = await bot.webapi.items.search('marching band', 5, 0);
results.items.forEach(item => console.log(item.itemId, item.itemName));
```

### Browse grabs
```javascript
const grabs = await bot.webapi.grabs.list({ limit: 5 });
grabs.grabs.forEach(grab => console.log(grab.title));
```

## Pagination

Endpoints that return lists support pagination through `next()`. If
there are more results available, the response includes a `next()`
method that fetches the next page with the same parameters.

```javascript
let page = await bot.webapi.rooms.list({ limit: 10 });

while (page) {
    page.rooms.forEach(room => console.log(room.name));
    page = page.next ? await page.next() : null;
}
```

## Important things to know

**The Web API is public data.** It reflects what Highrise exposes
publicly, hidden profiles, hidden active rooms, or private accounts
may return `null` for some fields.

**Some endpoints are unstable.** The grabs endpoint in particular may
return `500 Internal Server` errors intermittently. Always handle
errors gracefully.

**All responses have `ok` and `error`.** Check `result.ok` before
accessing data on important operations.