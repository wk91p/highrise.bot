# bot.webapi.grabs

The `bot.webapi.grabs` API fetches grab data from the Highrise Web API.
Grabs are the loot-box style reward packs in Highrise. Use this API to
list active grabs and inspect their rewards, costs, and kompu progress.

## Methods

### list(params)

Fetches a list of grabs from the Web API.

```javascript
const result = await bot.webapi.grabs.list();

if (result.ok) {
    result.grabs.forEach(grab => {
        console.log(`${grab.title} — expires ${grab.expiresAt}`);
    });
}
```

```javascript
// filter by title
const result = await bot.webapi.grabs.list({ title: 'creature' });

// limit results
const result = await bot.webapi.grabs.list({ limit: 5, sortOrder: 'desc' });
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | `number` | Maximum number of grabs to return |
| `sortOrder` | `string` | Order of results (`"asc"` or `"desc"`) |
| `title` | `string` | Filter grabs by title |
| `startsAfter` | `string` | Return grabs after this grab ID (pagination) |
| `endsBefore` | `string` | Return grabs before this grab ID (pagination) |

**Returns:** [`GrabsResponse`](#grabsresponse)

> [!NOTE]
> This endpoint may return a `500 Internal Server` error intermittently.
> Always check `result.ok` before accessing data.

### get(grabId)

Fetches full details for a specific grab by ID.

```javascript
const grab = await bot.webapi.grabs.get('grab_id_here');

if (grab.ok) {
    console.log(`${grab.title}`);
    console.log(`Rewards: ${grab.rewards.length}`);
    console.log(`Tradable: ${grab.isTradable}`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `grabId` | `string` | The grab's unique ID |

**Returns:** [`GrabResponse`](#grabresponse)

> [!NOTE]
> This endpoint may return a `500 Internal Server` error intermittently.

## Complete example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!grabs') {
        const result = await bot.webapi.grabs.list({ limit: 5, sortOrder: 'desc' });

        if (!result.ok || result.grabs.length === 0) {
            await bot.message.send('Could not fetch grabs right now.');
            return;
        }

        const lines = result.grabs.map(g => `• ${g.title}`);
        await bot.message.send(`Latest grabs:\n${lines.join('\n')}`);
        return;
    }

    if (cmd === '!grab') {
        const query = message.args(0);

        if (!query) {
            await bot.message.send('Usage: !grab <title>');
            return;
        }

        const result = await bot.webapi.grabs.list({ title: query, limit: 1 });

        if (!result.ok || result.grabs.length === 0) {
            await bot.message.send(`No grab found for: ${query}`);
            return;
        }

        const grab = result.grabs[0];
        const rewardNames = grab.rewards.map(r => r.itemId ?? r.category).join(', ');

        await bot.message.send(
            `${grab.title}\nRewards: ${rewardNames}\nTradable: ${grab.isTradable ? 'Yes' : 'No'}`
        );
        return;
    }
});
```

## GrabsResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;

    grabs: Grab[];       // list of grabs
    total: number;       // total grabs available
    firstId: string;     // first grab ID in the current page
    lastId: string;      // last grab ID in the current page
    next(): Promise<GrabsResponse> | null;  // fetches the next page
}
```

## GrabResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;

    grabId: string;
    title: string;
    description: string;
    bannerImgUrl: string;
    primaryImgUrl: string | null;
    secondaryImgUrl: string | null;
    startsAt: Date;
    expiresAt: Date;
    isTradable: boolean;
    rewards: Reward[];
    costs: Reward[];
    kompuRewards: Reward[];
    limitedTimeKompu: LimitedTimeKompu | null;
    progressReward: unknown | null;
}
```

### Reward

```typescript
{
    category: string;          // reward category (e.g. 'outfit', 'gems')
    amount: number;            // reward amount
    rewardId: string;          // unique reward identifier
    itemId: string | null;     // item ID for outfit rewards, null for currency
    accountBound: boolean;     // whether the reward is account-bound
    metadata: {
        nfiMetadata: unknown | null;
        nfiTemplateMetadata: unknown | null;
    } | null;
    bannerItem: boolean;       // whether this is the grab's featured item
}
```

### LimitedTimeKompu

```typescript
{
    expiresAt: Date;     // UTC expiry timestamp
    rewards: Reward[];   // limited-time kompu rewards
}
```

## Important things to know

**`itemId` is `null` for currency rewards.** When a reward's `category`
is `'gems'` or a non-item type, `itemId` will be `null`. Use `category`
and `amount` instead.

**`costs` contains what it costs to spin the grab.** Typically one
entry with the currency and amount required per spin.

**`kompuRewards` are the guaranteed completion rewards.** These are the
items awarded after collecting all items from the grab.

**This endpoint is unstable.** `500` errors from the Highrise Web API
are not uncommon on grabs. Wrap your calls in error handling and
communicate gracefully to users when data is unavailable.