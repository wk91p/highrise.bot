const BaseEventHandler = require("../../Base/BaseEventHandler");
const { SessionMetadata } = require("../../Models/EventModels");

class SessionMetadataHandler extends BaseEventHandler {
    handle(data, emit) {
        const metadata = new SessionMetadata(data)
        this.state.set('metadata', metadata)
        this.state.set("attempts", 0)

        emit("Ready", metadata)
    }
}

module.exports = SessionMetadataHandler