const BaseEventHandler = require("../../Base/BaseEventHandler");
const { HiddenChannel } = require("../../Models/EventModels");

class ChannelHandler extends BaseEventHandler {
    handle(data, emit) {
        const channel = new HiddenChannel(data)

        emit("Channel", channel.sender_id, channel.message, channel.tags)
    }
}

module.exports = ChannelHandler