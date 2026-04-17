const BaseEventHandler = require("../../Base/BaseEventHandler");
const { User } = require("../../Models/EventModelComponents");

class UserLeftHandler extends BaseEventHandler {
    handle(data, emit) {
        const user = new User(data.user.id, data.user.username)

        emit("UserLeft", user)
    }
}

module.exports = UserLeftHandler