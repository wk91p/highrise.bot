const EventEmitter = require('node:events')
const { WebSocket } = require("ws");

const OpenHandler = require('../Networking/WebsocketHandlers/OpenHandler');
const MessageHandler = require('../Networking/WebsocketHandlers/MessageHandler');
const ErrorHandler = require('../Networking/WebsocketHandlers/ErrorHandler');
const CloseHandler = require('../Networking/WebsocketHandlers/CloseHandler');

const { EventToListener } = require('../Constants/WebsocketConstants');
const Logger = require('../Utils/Logger');

const KeepAliveHandler = require('../Networking/Core/KeepAlive');
const Sender = require('../Networking/Core/Sender');
const BotContext = require('../Contexts/BotContext');

const BotApi = require('../Api');
const Validator = require("../Utils/Validator")
const { RolesConfig } = require('../Config/configs');

class HighriseCore extends EventEmitter {
    #keepaliveHandler
    #openHandler
    #messageHandler
    #errorHandler
    #closeHandler

    #validator
    #options
    #logger
    #sender
    #botApi
    #state
    #ctx
    #ws

    constructor(options = {}) {
        super()
        this.setMaxListeners(100)

        this.#ws = null
        this.#state = new Map()
        this.#logger = new Logger()
        this.#options = options
    }

    async logout() {
        this.#keepaliveHandler.stop()
        this.#state.set('doNotReconnect', true)
        this.#cleanup()

        this.#logger.info('Connection', 'Logged out successfully')
    }

    async login(token, roomId) {
        this.#cleanup()
        this.#state.set('doNotReconnect', false)

        const events = this.#getWebsocketEvents()

        this.#ws = new WebSocket(`wss://highrise.game/web/botapi?events=${events.join(',')}`, {
            headers: {
                "api-token": token,
                "room-id": roomId
            },
            perMessageDeflate: false
        })

        this.#logger.info("Connection", `Connecting to ${`wss://highrise.game/web/botapi?events=${events.join(',')}`}`)

        this.#ws.setMaxListeners(100)

        this.#state.set('credential', { token, roomId })
        this.#state.set("intervals", [])

        this.#setupHandlers()
        this.#setupApi()
        this.#setupListeners()
    }

    setToken(newToken) {
        const { roomId } = this.#getCredential()
        this.#state.set("credential", { token: newToken, roomId })
    }

    setRoomId(newRoomId) {
        const { token } = this.#getCredential()
        this.#state.set("credential", { token, roomId: newRoomId })
    }

    async reconnect() {
        const { token, roomId } = this.#getCredential()

        this.#logger.info('Connection', 'Reconnecting...')
        await this.logout()
        await this.login(token, roomId)
    }

    #getWebsocketEvents() {
        const registered = this.eventNames()
        const validEvents = []

        for (const event of registered) {
            const wsEvent = EventToListener[event]
            if (wsEvent) {
                validEvents.push(wsEvent)
            } else {
                this.#logger.warn("Events", `Unknown event "${event}", skipping...`)
            }
        }

        return validEvents
    }

    #getCredential() {
        const { token, roomId } = this.#state.get("credential")
        if (!token || !roomId) {
            this.#logger.info("System", `Either token or roomId are not set in-bot, stopping action...`)
            return;
        }

        return { token, roomId }
    }

    #setupListeners() {
        this.#ws.on('open', this.#openHandler.handle.bind(this.#openHandler))
        this.#ws.on('message', this.#messageHandler.handle.bind(this.#messageHandler))
        this.#ws.on('error', this.#errorHandler.handle.bind(this.#errorHandler))
        this.#ws.on('close', this.#closeHandler.handle.bind(this.#closeHandler))
    }

    #setupHandlers() {
        this.#setupCore()
        this.#setupWebsocketHandlers()
    }

    #setupCore() {
        this.#sender = new Sender(this.#ws, this.#logger)
        this.#validator = new Validator()
        const configs = [
            new RolesConfig(this.#validator).setup(this.#options.roles)
        ]

        this.#ctx = new BotContext(
            this.#sender,
            this.#logger,
            this.#state,
            this.#validator,
            configs
        )

        this.#botApi = new BotApi(this.#ctx)
    }

    #setupWebsocketHandlers() {
        this.#keepaliveHandler = new KeepAliveHandler(this.#ctx)
        this.#openHandler = new OpenHandler(this.#ctx, this.#keepaliveHandler)
        this.#messageHandler = new MessageHandler(
            this.#ctx,
            this.#botApi,
            this.emit.bind(this)
        )
        this.#errorHandler = new ErrorHandler(this.#ctx)
        this.#closeHandler = new CloseHandler(
            this.#ctx,
            this.#keepaliveHandler,
            this.reconnect.bind(this)
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

        for (const interval of (this.#state.get("intervals") ?? [])) {
            clearInterval(interval)
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