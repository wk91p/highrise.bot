# bot.webapi.posts

The `bot.webapi.posts` API fetches posts from Highrise user profiles.
Get a specific post by ID or browse a user's public posts.

## Methods

### get(postId)

Fetches full details for a specific post, including its comments.

```javascript
const post = await bot.webapi.posts.get('post_id_here');

if (post.ok) {
    console.log(`${post.type} post by ${post.authorId}`);
    console.log(`Likes: ${post.likes} | Comments: ${post.comments}`);
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `postId` | `string` | The post's unique ID |

**Returns:** [`PostResponse`](#postresponse)

> [!NOTE]
> This endpoint may return a `500 Internal Server` error intermittently.
> Handle errors gracefully.

### list(params)

Fetches a filtered, paginated list of posts.

```javascript
// all public posts
const posts = await bot.webapi.posts.list();

// posts by a specific user
const posts = await bot.webapi.posts.list({ authorId: userId });

// limit results
const posts = await bot.webapi.posts.list({ authorId: userId, limit: 10 });
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | `number` | Maximum number of posts to return |
| `sortOrder` | `"asc"` \| `"desc"` | Order of results |
| `authorId` | `string` | Filter posts by author user ID |
| `startsAfter` | `string` | Return posts after this post ID (pagination) |
| `endsBefore` | `string` | Return posts before this post ID (pagination) |

**Returns:** [`PostsResponse`](#postsresponse)

> [!NOTE]
> This endpoint may return an `Unable to fetch posts.` error. Always
> check `result.ok` before accessing the data.

## Complete example

```javascript
bot.on('Chat', async (user, message) => {
    const cmd = message.command();

    if (cmd === '!posts') {
        const target = message.mentions(0) || message.args(0);

        if (!target) {
            await bot.message.send('Usage: !posts @username');
            return;
        }

        const profile = await bot.webapi.users.get(target);

        if (!profile.ok) {
            await bot.message.send(`Could not find user: ${target}`);
            return;
        }

        const result = await bot.webapi.posts.list({ authorId: profile.id, limit: 5 });

        if (!result.ok || result.posts.length === 0) {
            await bot.message.send(`${target} has no posts.`);
            return;
        }

        await bot.message.send(`${target} has ${result.total} posts.`);
        return;
    }

    if (cmd === '!toplook') {
        const target = message.mentions(0) || message.args(0);
        if (!target) return;

        const profile = await bot.webapi.users.get(target);
        if (!profile.ok) return;

        const result = await bot.webapi.posts.list({
            authorId: profile.id,
            limit: 20,
            sortOrder: 'desc'
        });

        if (!result.ok || result.posts.length === 0) {
            await bot.message.send(`No posts found for ${target}.`);
            return;
        }

        const looks = result.posts.filter(p => p.type === 'look');

        if (looks.length === 0) {
            await bot.message.send(`${target} has no look posts.`);
            return;
        }

        const top = looks.sort((a, b) => b.likes - a.likes)[0];
        await bot.message.send(`${target}'s top look has ${top.likes} likes.`);
        return;
    }
});
```

## PostResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;

    postId: string;                                 // unique post ID
    authorId: string;                               // author's user ID
    createdAt: Date;                                // UTC creation timestamp
    type: 'look' | 'text' | 'photo' | 'video';      // post type
    visibility: 'public';                           // post visibility
    mediaUrl: string | null;                        // media URL if present
    caption: string | null;                         // post caption
    likes: number;                                  // like count
    comments: number;                               // comment count
    reposts: number;                                // repost count
    body: PostBody | null;                          // content for look/text posts
    featuredUserIds: unknown[];                     // featured users (if any)
    commentsList: Comment[];                        // full list of comments
}
```

### PostBody

```typescript
{
    text: string | null;           // text content (only for 'text' type posts)
    inventory: {
        items: {
            item_id: string;
            active_palette: number;
            account_bound: boolean;
        }[]
    }
}
```

### Comment

```typescript
{
    id: string;          // unique comment ID
    postId: string;      // ID of the post this comment belongs to
    authorId: string;    // commenter's user ID
    authorName: string;  // commenter's username
    content: string;     // comment text
    likes: number;       // comment like count
}
```

## PostsResponse

```typescript
{
    ok: boolean;
    error: string | null;
    hasError(): boolean;

    posts: Post[];       // list of posts
    total: number;       // total post count (for the user if authorId was set)
    firstId: string | null;
    lastId: string | null;
    next(): Promise<PostsResponse> | null;   // fetches the next page
}
```

## Important things to know

**Filter by `authorId` to get a user's posts.** Resolve the username
to an ID first using `bot.webapi.users.get()`.

**`body` is only populated on `look` and `text` posts.** For `photo`
and `video` posts, `body` will be `null`.

**`commentsList` is only on `PostResponse`.** The `Post` objects inside
`PostsResponse.posts` do not include comments. Use `get()` on a
specific post to retrieve its full comment list.

**`total` reflects the filtered count.** When using `authorId`, `total`
is the number of posts by that user, not all posts on Highrise.