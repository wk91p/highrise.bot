const BaseEventHandler = require("../../Base/BaseEventHandler");
const { Voice } = require("../../Models/EventModels");

class VoiceHandler extends BaseEventHandler {
    handle(data, emit) {
        const voice = new Voice(data)

        emit("Voice", voice.users, voice.seconds_left, voice.ended)
    }
}

module.exports = VoiceHandler