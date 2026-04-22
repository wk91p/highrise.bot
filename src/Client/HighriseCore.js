const EventEmitter = require('node:events')
const { WebSocket } = require("ws");

const OpenHandler = require('../Networking/WebsocketHandlers/OpenHandler');
const MessageHandler = require('../Networking/WebsocketHandlers/MessageHandler');
const ErrorHandler = require('../Networking/WebsocketHandlers/ErrorHandler');
const CloseHandler = require('../Networking/WebsocketHandlers/CloseHandler');

const { WebsocketEvents } = require('../Constants/WebsocketConstants');
const Logger = require('../Utils/Logger');

const KeepAliveHandler = require('../Networking/Core/KeepAlive');
const Sender = require('../Networking/Core/Sender');
const BotContext = require('../Contexts/BotContext');

const BotApi = require('../Api');

class HighriseCore extends EventEmitter {
    #keepaliveHandler
    #openHandler
    #messageHandler
    #errorHandler
    #closeHandler

    #logger
    #sender
    #botApi
    #state
    #ctx
    #ws

    constructor() {
        super()
        this.setMaxListeners(100)

        this.#ws = null
        this.#state = new Map()
    }

    async logout() {
        this.#keepaliveHandler.stop()
        this.#state.set('doNotReconnect', true)
        this.#cleanup()

        this.#logger.info('Connection', 'Logged out successfully')
    }

    async login(token, roomId) {
        this.#cleanup()

        this.#ws = new WebSocket(`wss://highrise.game/web/botapi?events=${WebsocketEvents.join(',')}`, {
            headers: {
                "api-token": token,
                "room-id": roomId
            },
            perMessageDeflate: false
        })

        this.#ws.setMaxListeners(100)

        this.#state.set('credential', { token, roomId })

        this.#setupHandlers()
        this.#setupApi()
        this.#setupListeners()
    }

    async reconnect() {
        const { token, roomId } = this.credential
        this.#logger.info('Connection', 'Reconnecting...')
        await this.logout()
        await this.login(token, roomId)
    }


    #setupListeners() {
        this.#ws.on('open', this.#openHandler.handle.bind(this.#openHandler))
        this.#ws.on('message', this.#messageHandler.handle.bind(this.#messageHandler))
        this.#ws.on('error', this.#errorHandler.handle.bind(this.#errorHandler))
        this.#ws.on('close', this.#closeHandler.handle.bind(this.#closeHandler))
    }

    #setupHandlers() {
        this.#logger = new Logger()
        this.#sender = new Sender(this.#ws, this.#logger)
        this.#ctx = new BotContext(
            this.#sender,
            this.#logger,
            this.#state
        )

        this.#botApi = new BotApi(this.#ctx)

        this.#keepaliveHandler = new KeepAliveHandler(this.#ctx)
        this.#openHandler = new OpenHandler(
            this.#ctx,
            this.#keepaliveHandler
        )
        this.#messageHandler = new MessageHandler(this.#ctx, this.#botApi, this.emit.bind(this))
        this.#errorHandler = new ErrorHandler(this.#ctx)
        this.#closeHandler = new CloseHandler(
            this.#ctx,
            this.#keepaliveHandler,
            () => this.login(this.credential.token, this.credential.roomId)
        )
    }

    #setupApi() {
        this.utils = this.#botApi.utils
        this.message = this.#botApi.message
        this.whisper = this.#botApi.whisper
        this.direct = this.#botApi.direct
        this.channel = this.#botApi.channel
        this.inventory = this.#botApi.inventory
        this.player = this.#botApi.player
        this.room = this.#botApi.room
        this.webapi = this.#botApi.webapi
    }

    #cleanup() {
        if (this.#ws) {
            this.#ws.removeAllListeners()
            this.#ws.close()
            this.#ws = null
            this.#sender.cleanUp()
        }
    }

    get credential() {
        return this.#state.get("credential")
    }

    get metadata() {
        return this.#state.get("metadata")
    }

    get connectTime() {
        return this.#state.get("connectTime")
    }
}

module.exports = HighriseCore