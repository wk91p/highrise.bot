const BaseResponse = require("../../../Base/BaseResponse");

class ItemsSearchResponse extends BaseResponse {
    build(data, listNext) {
        this.items = data.items.map(item => ({
            itemId: item.item_id,
            itemName: item.item_name,
            category: item.category,
            createdAt: new Date(item.created_at),
            releaseDate: new Date(item.release_date), 
            descriptionKey: item.description_key,
            inspiredBy: item.inspired_by,
            isPurchasable: item.is_purchasable,
            isTradable: item.is_tradable,
            rarity: item.rarity,
            keywords: item.keywords
        }))

        if (this.items.length) {
            this.next = async () => await listNext(this.items.length);
        } else {
            this.next = null;
        }

        this.total = data.total
    }
}

class ItemResponse extends BaseResponse {
    build(data) {
        this.item = this.buildItem(data.item)
        this.relatedItems = this.buildRelatedItems(data.related_items)
        this.storefrontListings = this.buildStorefrontListings(data.storefront_listings)
    }

    buildItem(item) {
        return {
            itemId: item.item_id,
            itemName: item.item_name,
            acquisitionCost: item.acquisition_cost,
            acquisitionAmount: item.acquisition_amount,
            acquisitionCurrency: item.acquisition_currency,
            category: item.category,
            createdAt: new Date(item.created_at),
            releaseDate: new Date(item.release_date),
            descriptionKey: item.description_key,
            inspiredBy: item.inspired_by,
            isPurchasable: item.is_purchasable,
            isTradable: item.is_tradable,
            imageUrl: item.image_url,
            iconUrl: item.icon_url,
            rarity: item.rarity,
            keywords: item.keywords
        }
    }

    buildRelatedItems(related) {
        return {
            affiliations: related.affiliations.map(a => ({
                id: a.id,
                title: a.title,
                type: a.type,
                eventType: a.event_type
            })),
            items: related.items.map(i => ({
                itemId: i.item_id,
                dispName: i.disp_name,
                rarity: i.rarity
            }))
        }
    }

    buildStorefrontListings(storefront) {
        return {
            pages: storefront.pages,
            total: storefront.total,
            sellers: storefront.sellers.map(s => ({
                userId: s.user_id,
                username: s.username,
                lastConnectedAt: s.last_connected_at ? new Date(s.last_connected_at) : null
            }))
        }
    }
}

module.exports = {
    ItemResponse,
    ItemsSearchResponse
}
