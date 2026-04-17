const BaseEventHandler = require("../../Base/BaseEventHandler");
const { Message } = require("../../Models/EventModels");
const { User } = require("../../Models/EventModelComponents");

class ChatHandler extends BaseEventHandler {    
    handle(data, emit) {
        if (data.user.id === this.state.get('metadata').bot_id) return

        const user = new User(data.user.id, data.user.username)
        const message = new Message(data)

        if (data.whisper) {
            emit('Whisper', user, message)
        } else {
            emit('Chat', user, message)
        }
    }
}

module.exports = ChatHandler