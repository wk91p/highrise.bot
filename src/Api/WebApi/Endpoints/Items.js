const { ItemsSearchResponse, ItemResponse } = require("../../../Models/ResponseModels/WebApi/ItemsResponses")

class ItemsEndpoint {
    #validator
    #client

    constructor(ctx, client) {
        this.#client = client
        this.#validator = ctx.validator
    }

    async search(itemName, limit, skip = 0) {
        try {
            let queryParams = {}
            this.#validator
                .required(itemName, "itemName")
                .string(itemName, "itemName")
            queryParams.query = itemName

            if (limit) {
                this.#validator
                    .nonNegative(limit, "limit")
                queryParams.limit = limit
            }

            if (skip) {
                this.#validator
                    .nonNegative(skip, "skip")
                queryParams.skip = skip
            }

            const result = await this.#client.get("/items/search", queryParams)
            const nextCaller = (toSkip) => this.search(itemName, limit, toSkip + skip);

            return new ItemsSearchResponse(result, nextCaller)
        } catch (error) {
            let apiError = error?.response?.data
            return new ItemsSearchResponse({ error: apiError ? new Error(apiError) : error })
        }
    }

    async get(itemId) {
        try {
            this.#validator
                .required(itemId, 'itemId')
                .string(itemId, "itemId")

            const result = await this.#client.get(`/items/${itemId}`)
            return new ItemResponse(result)
        } catch (error) {
            let apiError = error?.response?.data
            return new ItemResponse({ error: apiError ? new Error(apiError) : error })
        }
    }
}

module.exports = ItemsEndpoint