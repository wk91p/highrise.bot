const BaseResponse = require("../../../Base/BaseResponse");
const { cloudflareCdnUrl } = require("../../../Constants/WebApiConstants");

function buildBody(body) {
    return {
        text: body.text === "None" ? null : body.text,
        inventory: {
            items: body.inventory.items
        }
    }
}

class PostsResponse extends BaseResponse {
    build(data, listNext) {
        this.posts = data.posts.map((post) => ({
            postId: post.post_id,
            authorId: post.author_id,
            createdAt: new Date(post.created_at),
            mediaUrl: post.type !== 'text'
                ? cloudflareCdnUrl.concat(post.file_key)
                : null,
            type: post.type,
            visibility: post.visibility,
            comments: post.num_comments,
            likes: post.num_likes,
            reposts: post.num_reposts,
            body: post.body ? buildBody(post.body) : null,
            caption: post.caption,
            featuredUserIds: post.featured_user_ids
        }))

        this.total = data.total

        this.firstId = data.first_id ? data.first_id : null
        this.lastId = data.last_id ? data.last_id : null

        if (this.lastId) {
            this.next = async () => await listNext(this.lastId);
        } else {
            this.next = null;
        }
    }
}

module.exports = {
    PostsResponse
}