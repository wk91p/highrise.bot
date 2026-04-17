# The Validator

The SDK exports a `Validator` class you can use in your own bot code to
validate user input before acting on it. The same validator is used
internally by every API method in the SDK, so you already know it works
the way you expect.

## Creating a validator

```javascript
const { Validator } = require('highrise.bot');

const validate = new Validator();
```

## How it works

Every method on the validator throws an `Error` if the value does not
pass the check. This means you wrap your validation calls in a
`try/catch` block and handle the error in one place instead of writing
if/else checks everywhere:

```javascript
bot.on('Chat', async (user, message) => {
    if (message.command() === '!mute') {
        const target = message.args(0);
        const duration = Number(message.args(1));

        try {
            validate
                .required(target, 'target')
                .string(target, 'target')
                .required(duration, 'duration')
                .positive(duration, 'duration')
        } catch (error) {
            await bot.message.send(`Invalid input: ${error.message}`);
            return;
        }

        // safe to use target and duration here
        const found = await bot.room.users.find(target);
        if (!found) {
            await bot.message.send(`${target} is not in the room.`);
            return;
        }

        await bot.room.moderation.mute(found.user.id, duration);
        await bot.message.send(`${target} has been muted for ${duration} seconds.`);
    }
});
```

## Method chaining

Every method returns the `Validator` instance so you can chain multiple
checks together in one block:

```javascript
validate
    .required(username, 'username')
    .string(username, 'username')
    .minLength(username, 3, 'username')
    .match(username, /^[a-z0-9]+$/, 'username');
```

The chain stops at the first method that fails. If `string()` throws,
`minLength()` and `match()` never run.

## All methods

### Highrise specific

These two methods validate Highrise-specific data structures in a single
call so you do not have to validate each coordinate or anchor property
individually:

| Method | What it checks |
|---|---|
| `.isCoordinates(x, y, z, facing)` | All four position values including a valid facing direction |
| `.isAnchor(entity_id, anchor_ix)` | An anchor entity ID and its seat index |

`facing` must be one of `"FrontRight"`, `"FrontLeft"`, `"BackRight"`,
or `"BackLeft"`. Anything else throws.

### Type and existence

| Method | What it checks |
|---|---|
| `.required(val, field)` | Value is not `null` or `undefined` |
| `.string(val, field)` | Value is a non-empty string |
| `.number(val, field)` | Value is a valid number and not `NaN` |
| `.boolean(val, field)` | Value is `true` or `false` |
| `.array(val, field)` | Value is an array |
| `.object(val, field)` | Value is a plain object, not an array, not null |

### Numbers

| Method | What it checks |
|---|---|
| `.integer(val, field)` | Value is a whole number with no decimal |
| `.positive(val, field)` | Value is greater than zero |
| `.nonNegative(val, field)` | Value is zero or greater |
| `.range(val, min, max, field)` | Value falls between `min` and `max` inclusive |

### Strings

| Method | What it checks |
|---|---|
| `.minLength(val, min, field)` | String is at least `min` characters long |
| `.maxLength(val, max, field)` | String is no longer than `max` characters |
| `.match(val, regex, field)` | String matches the regular expression |

### Arrays

| Method | What it checks |
|---|---|
| `.nonEmptyArray(val, field)` | Value is an array with at least one item |
| `.oneOf(val, options, field)` | Value exists in the provided array of options |

## The field name

Every method takes a `field` argument as its last parameter. This is the
name that appears in the error message when the check fails. Always use
a name that makes sense to whoever reads the error:

```javascript
validate.string(userId, 'userId');
// throws: "userId must be a non-empty string"

validate.positive(amount, 'amount');
// throws: "amount must be a positive number"

validate.range(page, 1, 100, 'page number');
// throws: "page number must be between 1 and 100"
```

Use descriptive field names. `'userId'` is better than `'id'`.
`'tip amount'` is better than `'val'`. The clearer the field name, the
more useful the error message is to whoever reads it, next page we will explain each event and what it gives you to work with.