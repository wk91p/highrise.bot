# Outfit Item

Represents a Highrise clothing item that can be equipped to a bot.
Provides a convenient constructor for creating outfit items without writing
raw objects by hand.

## Parameters
| Param | Type | Description |
|--------|------|-------------|
| `id` | `string` | The unique item identifier (e.g., `"shirt-f_marchingband"`) |
| `palette` | `number` | The color palette index to apply (default: `0`) |
| `amount` | `number` | Quantity of the item (default: `1`) |
| `account_bound` | `boolean` | Whether the item is account bound (default: `false`) |

## Creating an Outfit Item
The class can be imported from the sdk directly
```javascript
const { OutfitItem } = require("highrise.bot")

const shirt = new OutfitItem('shirt-f_marchingband');

await bot.inventory.outfit.set([ shirt ]);
```

> [!NOTE]
> Only that item will be equipped, any previous outfit will be unequipped

## New Instance Object
```typescript
{
    // The unique identifier of the item
    id: string;

    // The category of the item
    type: "clothing" | string;

    // Quantity of the item
    amount: number;

    // Whether the item is bound to the account
    account_bound: boolean;

    // The active color palette index
    active_palette: number;
}
```