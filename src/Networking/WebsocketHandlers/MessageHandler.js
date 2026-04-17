const { ErrorMessages } = require("../../Constants/ErrorConstants");
const ChannelHandler = require("../../Networking/EventHandlers/Channel");
const ChatHandler = require("../../Networking/EventHandlers/Chat");
const DirectHandler = require("../../Networking/EventHandlers/Direct");
const ModerationHandler = require("../../Networking/EventHandlers/Moderation");
const MovementHandler = require("../../Networking/EventHandlers/Movement");
const SessionMetadataHandler = require("../../Networking/EventHandlers/Ready");
const TipHandler = require("../../Networking/EventHandlers/Tip");
const UserJoinedHandler = require("../../Networking/EventHandlers/UserJoined");
const UserLeftHandler = require("../../Networking/EventHandlers/UserLeft");

class MessageHandler {
    constructor(ctx, botApi, emit) {
        this.logger = ctx.logger
        this.sender = ctx.sender
        this.state = ctx.state
        this.botApi = botApi
        this.emit = emit

        this.handlers = {
            SessionMetadata: new SessionMetadataHandler(ctx),
            ChatEvent: new ChatHandler(ctx),
            UserMovedEvent: new MovementHandler(ctx),
            UserLeftEvent: new UserLeftHandler(ctx),
            UserJoinedEvent: new UserJoinedHandler(ctx),
            TipReactionEvent: new TipHandler(ctx),
            MessageEvent: new DirectHandler(ctx, this.botApi.direct),
            RoomModeratedEvent: new ModerationHandler(ctx),
            ChannelEvent: new ChannelHandler(ctx)
        }
    }

    async handle(raw) {
        try {
            const message = JSON.parse(raw);
            if (!message.rid && message._type === 'Error') {
                this.logger.warn('Websocket', message.message)
                if (this.#isFatal(message)) {
                    this.state.set('doNotReconnect', true)
                }
                return
            }

            if (this.sender.handlePending(message)) return

            await this.#handleEvents(message)
        } catch (error) {
            this.logger.error(error)
        }
    }

    #isFatal(message) {
        return ErrorMessages.FATAL.includes(message.message)
    }

    async #handleEvents(message) {
        const type = message._type
        if (type === "KeepaliveResponse") return

        const event = this.handlers[type]
        if (event) {
            await event.handle(message, this.emit)
        } else {
            this.logger.warn(`Unhandled event type`, JSON.stringify(message))
        }
    }
}

module.exports = MessageHandler