const InventoryApi = require("./Inventory");
const ChannelApi = require("./Message/Channel");
const ChatApi = require("./Message/Chat");
const DirectApi = require("./Message/Direct");
const WhisperApi = require("./Message/Whisper");
const PlayerApi = require("./Player");
const RoomApi = require("./Room");
const UtilsApi = require("./Utils");
const WebApi = require("./WebApi");

class BotApi {
    constructor(ctx) {
        this.utils = new UtilsApi(ctx)
        this.message = new ChatApi(ctx, this.utils)
        this.whisper = new WhisperApi(ctx, this.utils)
        this.direct = new DirectApi(ctx, this.utils)
        this.channel = new ChannelApi(ctx, this.utils)
        this.room = new RoomApi(ctx, this.utils)
        this.player = new PlayerApi(ctx, this.utils)
        this.inventory = new InventoryApi(ctx, this.utils)
        this.webapi = new WebApi(ctx)
    }
}

module.exports = BotApi