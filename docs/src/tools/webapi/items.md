# bot.webapi.items

The `bot.webapi.items` API fetches item data from the Highrise Web API.
Look up a specific item by ID, search by name, or browse the full catalog
filtered by category and rarity.

## Methods

### get(itemId)

Fetches full details for a specific item, including related items,
affiliations, and current storefront listings.

```javascript
const result = await bot.webapi.items.get('shirt-f_marchingband');

if (result.ok) {
    console.log(result.item.itemName);
    console.log(`Rarity: ${result.item.rarity}`);
    console.log(`Tradable: ${result.item.isTradable}`);
    console.log(`Sellers: ${result.storefrontListings.total}`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `itemId` | `string` | The item's unique ID |

**Returns:** [`ItemResponse`](#itemresponse)

> [!NOTE]
> This endpoint may return a `500 Internal Server` error intermittently.

### search(itemName, limit, skip)

Searches items by name. Useful for finding item IDs when you only know
the display name.

```javascript
const results = await bot.webapi.items.search('marching band', 5, 0);

results.items.forEach(item => {
    console.log(`${item.itemId}. ${item.itemName}`);
});
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `itemName` | `string` | Name to search for |
| `limit` | `number` | Maximum number of results to return |
| `skip` | `number` | Number of results to skip (for pagination) |

**Returns:** [`ItemsSearchResponse`](#itemssearchresponse)

### list(params)

Fetches a filtered, paginated list of items from the catalog.

```javascript
// browse all items
const items = await bot.webapi.items.list({});

// filter by category
const items = await bot.webapi.items.list({ category: 'hair' });

// filter by rarity
const items = await bot.webapi.items.list({ rarity: 'legendary', limit: 10 });
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | `number` | Maximum number of items to return |
| `sortOrder` | `"asc"` \| `"desc"` | Order of results |
| `itemName` | `string` | Filter by item name |
| `category` | `string` | Filter by category (e.g. `'hair'`, `'eye'`) |
| `rarity` | `string` | Filter by rarity (e.g. `'rare'`, `'epic'`, `'legendary'`) |
| `startsAfter` | `string` | Return items after this item ID (pagination) |
| `endsBefore` | `string` | Return items before this item ID (pagination) |

**Returns:** [`ItemsResponse`](#itemsresponse)

> [!NOTE]
> This endpoint does not return emotes.

## Complete example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!item') {
        const query = message.args(0);

        if (!query) {
            await bot.message.send('Usage: !item <name>');
            return;
        }

        const results = await bot.webapi.items.search(query, 1, 0);

        if (!results.ok || results.items.length === 0) {
            await bot.message.send(`No item found for: ${query}`);
            return;
        }

        const found = results.items[0];
        const detail = await bot.webapi.items.get(found.itemId);

        if (!detail.ok) {
            await bot.message.send('Could not fetch item details.');
            return;
        }

        const { item, storefrontListings } = detail;

        const lines = [
            `${item.itemName} (${item.rarity})`,
            `Category: ${item.category}`,
            `Tradable: ${item.isTradable ? 'Yes' : 'No'}`,
            `Sellers: ${storefrontListings.total}`,
        ];

        await bot.message.send(lines.join('\n'));
        return;
    }

    if (cmd === '!legendary') {
        const result = await bot.webapi.items.list({ rarity: 'legendary', limit: 5 });

        if (!result.ok || result.items.length === 0) {
            await bot.message.send('Could not fetch legendary items.');
            return;
        }

        const names = result.items.map(i => i.itemName).join(', ');
        await bot.message.send(`Legendary items: ${names}`);
        return;
    }
});
```

## ItemResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;

    item: DetailedItem;
    relatedItems: RelatedItems;
    storefrontListings: StorefrontListings;
}
```

### DetailedItem

```typescript
{
    itemId: string;               // unique item identifier
    itemName: string;             // display name
    category: string;             // item category (e.g. 'eye', 'hair')
    rarity: string;               // rarity (e.g. 'epic', 'legendary')
    isPurchasable: boolean;       // whether the item can be bought
    isTradable: boolean;          // whether the item can be traded
    acquisitionCost: number;      // cost to acquire
    acquisitionAmount: number;    // amount received on acquisition
    acquisitionCurrency: string;  // currency used ('gems' means tokens, 'gold')
    createdAt: Date;              // UTC creation timestamp
    releaseDate: Date;            // UTC release timestamp
    descriptionKey: string | null;
    inspiredBy: string[];         // user IDs this item was inspired by
    keywords: string[];           // associated keywords
    imageUrl: string | null;      // full image URL
    iconUrl: string | null;       // icon image URL
}
```

### RelatedItems

```typescript
{
    affiliations: {
        id: string;
        title: string;           // e.g. 'Creature Club Anniversary'
        type: string;            // e.g. 'grab', 'event'
        eventType: string | null;
    }[];
    items: {
        itemId: string;
        dispName: string;
        rarity: string;
    }[];
}
```

### StorefrontListings

```typescript
{
    pages: number;     // total pages of sellers
    total: number;     // total sellers listing this item
    sellers: {
        userId: string;
        username: string;
        lastConnectedAt: Date | null;  // null if the user's status is private
    }[];
}
```

## ItemsSearchResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;

    items: SearchItem[];    // list of matching items
    total: number;          // total results matching the query
    next(): Promise<ItemsSearchResponse> | null;  // fetches the next page
}
```

## ItemsResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;

    items: Item[];          // list of items
    total: number;          // total items available
    firstId: string | null;
    lastId: string | null;
    next(): Promise<ItemsResponse> | null;  // fetches the next page
}
```

## Important things to know

**Use `search()` to find an item ID from a name.** Item IDs follow
patterns like `'shirt-f_marchingband'` but are not always obvious.
Search by display name to find the ID, then use `get()` for full details.

**`acquisitionCurrency: 'gems'` means tokens.** The Web API uses `gems`
internally to refer to what the app displays as tokens.

**`list()` does not return emotes using the category `emote` .** Use `search()` if you need to look
up emote items specifically.

**`storefrontListings` shows current resellers.** This is live data. it
reflects who is selling the item on the in-game storefront at the time
of the request.