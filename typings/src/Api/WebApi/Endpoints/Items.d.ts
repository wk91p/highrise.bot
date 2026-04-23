import { ItemResponse, ItemsSearchResponse } from "../../../ResponseModels/WebApi/ItemsResponses";

/** Represents the Highrise WebApi `/items` endpoint */
declare class ItemsEndpoint {

    /**
     * Fetches data for a specific item from the WebApi
     * @param ItemID The item ID to fetch
     * @note expect some errors like getting `500 Internal Server` error.
     * @returns A promise that resolves to a {@link ItemResponse} containing the item's data
     * @example
     * ```javascript
     * const res = await bot.webapi.items.get("ItemID")
     * console.log(res)
     * ```
     */
    get(ItemID: string): Promise<ItemResponse>

    /**
     * Search a list of items from the WebApi.
     * @param itemName The name of the item to search for.
     * @param limit The maximum number of items to return.
     * @param skip The number of items to skip.
     * 
     * @returns A promise that resolves to a {@link ItemsSearchResponse} containing the items data and pagination method.
     */
    async search(itemName: string, limit: number, skip: number): Promise<ItemsSearchResponse>
}

export default ItemsEndpoint