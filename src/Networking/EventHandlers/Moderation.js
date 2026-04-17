const BaseEventHandler = require("../../Base/BaseEventHandler");
const { RoomModerate } = require("../../Models/EventModels");

class ModerationHandler extends BaseEventHandler {
    handle(data, emit) {
        const moderate = new RoomModerate(data)

        if (moderate.action.type === 'mute' && moderate.action.duration === 1) {
            moderate.action.type = 'unmute'
            moderate.action.duration = null
        }

        emit("Moderation", moderate.moderator, moderate.target, moderate.action)
    }
}

module.exports = ModerationHandler