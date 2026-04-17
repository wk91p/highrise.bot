const BaseEventHandler = require("../../Base/BaseEventHandler");
const { Position } = require("../../Models/EventModels");
const { User } = require("../../Models/EventModelComponents");

class UserJoinedHandler extends BaseEventHandler {
    handle(data, emit) {
        const user = new User(data.user.id, data.user.username)
        const position = new Position(data)

        emit("UserJoined", user, position)
    }
}

module.exports = UserJoinedHandler