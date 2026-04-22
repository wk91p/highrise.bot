const HandlerRegistry = require("./MessageHandlerCore/HandlerRegistry")
const MessageParser = require("./MessageHandlerCore/MessageParser")

const ChannelHandler = require("../EventHandlers/Channel")
const ChatHandler = require("../EventHandlers/Chat")
const DirectHandler = require("../EventHandlers/Direct")
const ModerationHandler = require("../EventHandlers/Moderation")
const MovementHandler = require("../EventHandlers/Movement")
const SessionMetadataHandler = require("../EventHandlers/Ready")
const TipHandler = require("../EventHandlers/Tip")
const UserJoinedHandler = require("../EventHandlers/UserJoined")
const UserLeftHandler = require("../EventHandlers/UserLeft")

const IgnoredEvents = new Set(["KeepaliveResponse"])

class MessageHandler {
    constructor(ctx, botApi, emit) {
        this.logger = ctx.logger
        this.sender = ctx.sender
        this.state = ctx.state
        this.emit = emit

        this.parser = new MessageParser()

        this.registry = new HandlerRegistry()
            .register(SessionMetadataHandler, ctx)
            .register(ChatHandler, ctx)
            .register(MovementHandler, ctx)
            .register(UserLeftHandler, ctx)
            .register(UserJoinedHandler, ctx)
            .register(TipHandler, ctx)
            .register(DirectHandler, ctx, botApi.direct)
            .register(ModerationHandler, ctx)
            .register(ChannelHandler, ctx)
    }

    async handle(rawData) {
        const { data, error } = this.parser.parse(rawData)
        if (error) {
            this.logger.error("MessageHandler:", error, rawData)
            return
        }

        try {
            if (this.parser.isError(data)) {
                this.logger.warn("Websocket", data.message)
                if (this.parser.isFatal(data)) {
                    this.state.set("doNotReconnect", true)
                }
                return
            }

            if (this.sender.handlePending(data)) return

            await this.#route(data)
        } catch (err) {
            this.logger.error("MessageHandler: unhandled error", err)
        }
    }

    async #route(data) {
        const type = data._type

        if (IgnoredEvents.has(type)) return

        await this.registry.dispatch(type, data, this.emit, this.logger)
    }
}

module.exports = MessageHandler