const BaseEventHandler = require("../../Base/BaseEventHandler");
const { Position, AnchorPosition } = require("../../Models/EventModels");
const { User } = require("../../Models/EventModelComponents");

class MovementHandler extends BaseEventHandler {
    handle(data, emit) {
        const user = new User(data.user.id, data.user.username)
        
        if ("x" in data.position) {
            const position = new Position(data)

            emit("Movement", user, position, null)
        } else {
            const anchor = new AnchorPosition(data)

            emit("Movement", user, null, anchor)
        }
    }
}

module.exports = MovementHandler