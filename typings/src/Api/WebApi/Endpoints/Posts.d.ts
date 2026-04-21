import { PostsResponse } from "../../../ResponseModels/WebApi/PostsResponses";

interface GetPostsParams {
    /** Maximum number of posts to return */
    limit?: number;
    /** Order of results (e.g. `"asc"` | `"desc"`) */
    sortOrder?: "asc" | "desc"
    /** Filter posts by author ID */
    authorId?: string;
    /** Return posts created after this postId (pagination) */
    startsAfter?: string;
    /** Return posts created before this postId (pagination) */
    endsBefore?: string;
}

/** Represents the Highrise WebApi `/posts` endpoint */
declare class PostsEndpoint {
    /**
     * Fetches a filtered list of posts from the WebApi.
     * 
     * @param params WebApi filtering options.
     * @note expect some issues like getting `Unable to fetch posts.` error.
     * 
     * @returns A promise that resolves to a {@link PostsResponse} containing the rooms data and pagination method.
     */
    list(params: GetPostsParams): Promise<PostsResponse>
}

export default PostsEndpoint