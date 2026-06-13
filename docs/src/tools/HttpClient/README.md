# HttpClient

`HttpClient` is a lightweight wrapper around [axios](https://axios-http.com) used internally by the SDK to make HTTP requests. You can use it directly to call any external API from your bot.

## Creating a client

The constructor accepts a standard [Axios config object](https://axios-http.com/docs/req_config). The most common options are:

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | `string` | Base URL prepended to every request (e.g. `"https://api.example.com"`) |
| `timeout` | `number` | Request timeout in milliseconds (default: `10000`) |
| `headers` | `object` | Default headers sent with every request |

```javascript
const { HttpClient } = require("highrise.bot")

const client = new HttpClient({
    baseURL: "https://api.chucknorris.io",
    timeout: 5000,
    headers: {
        "X-Custom-Header": "my-value"
    }
})
```

## Methods

### get(url, params)

Performs a GET request. `params` is an object that gets serialized into the URL as a query string.

```javascript
// GET https://api.chucknorris.io/jokes/random
const data = await client.get("/jokes/random")

// GET https://api.chucknorris.io/jokes/random?category=science
const data = await client.get("/jokes/random", { category: "science" })

console.log(data.value) // "Chuck Norris can divide by zero."
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The endpoint path, appended to `baseURL` |
| `params` | `object` | Key-value pairs serialized as query string (e.g. `{ category: "science" }` to `?category=science`) |

### post(url, data)

Performs a POST request. `data` is sent as a JSON body.

```javascript
// POST https://api.example.com/users
// Body: { "name": "John" }
const response = await client.post("/users", { name: "John" })
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The endpoint path |
| `data` | `object` | The JSON body to send with the request |

### put(url, data)

Performs a PUT request. Used to fully replace an existing resource.

```javascript
// PUT https://api.example.com/users/1
// Body: { "name": "John Updated" }
await client.put("/users/1", { name: "John Updated" })
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The endpoint path |
| `data` | `object` | The JSON body to send with the request |

### patch(url, data)

Performs a PATCH request. Used to partially update an existing resource.

```javascript
// PATCH https://api.example.com/users/1
// Body: { "email": "new@example.com" }
await client.patch("/users/1", { email: "new@example.com" })
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The endpoint path |
| `data` | `object` | The partial JSON body to send with the request |

### delete(url, params)

Performs a DELETE request. Optionally accepts query parameters.

```javascript
// DELETE https://api.example.com/users/1
await client.delete("/users/1")

// DELETE https://api.example.com/users?id=1
await client.delete("/users", { id: 1 })
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The endpoint path |
| `params` | `object` | Optional query parameters |

### withToken(token)

Returns a **new** `HttpClient` instance with an `Authorization: Bearer <token>` header attached to every request. The original client is not modified.

```javascript
const publicClient = new HttpClient({
    baseURL: "https://api.example.com"
})

// publicClient has no auth header
const authClient = publicClient.withToken("my-secret-token")

// only authClient sends Authorization: Bearer my-secret-token
const profile = await authClient.get("/profile")
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `token` | `string` | The bearer token to attach to the `Authorization` header |

**Returns:** A new `HttpClient` instance with the token attached.

## Complete example

This example uses the [Chuck Norris API](https://api.chucknorris.io), free, no sign up required.

```javascript
const { HttpClient } = require("highrise.bot")

const jokes = new HttpClient({
    baseURL: "https://api.chucknorris.io"
})

bot.on("Chat", async (user, message) => {
    const cmd = message.command()

    // !joke - sends a random joke
    if (cmd === "!joke") {
        try {
            const data = await jokes.get("/jokes/random")
            await bot.message.send(data.value)
        } catch (err) {
            await bot.message.send("Could not fetch a joke right now.")
        }
        return
    }

    // !joke science - sends a joke from a specific category
    if (cmd === "!jokecategory") {
        const category = message.args(0)

        if (!category) {
            await bot.message.send("Usage: !jokecategory <category>")
            return
        }

        try {
            // passes category as a query param → /jokes/random?category=science
            const data = await jokes.get("/jokes/random", { category })
            await bot.message.send(data.value)
        } catch (err) {
            await bot.message.send(`No jokes found for category: ${category}`)
        }
        return
    }
})
```

## Important things to know

**`baseURL` is prepended to every request path.** So if `baseURL` is `"https://api.chucknorris.io"` and you call `.get("/jokes/random")`, the full URL becomes `https://api.chucknorris.io/jokes/random`.

**`params` are not the request body.** They are key-value pairs appended to the URL as a query string. For sending data in the body, use `post`, `put`, or `patch` instead.

**`withToken` does not modify the original client.** It always returns a new instance. This is useful when you need both authenticated and unauthenticated requests from the same base client.

**Errors are not swallowed.** If a request fails (network error, timeout, non-2xx status), it throws. Always wrap calls in `try/catch`:

```javascript
try {
    const data = await client.get("/jokes/random")
} catch (err) {
    // handle the error
    await bot.message.send("Something went wrong.")
}
```