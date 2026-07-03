const EventEmitter = require('node:events')
const Highrise = require('./Highrise')
const { EventToListener } = require('../Constants/WebsocketConstants')
const Validator = require('../Tools/Validator')
const Logger = require('../Tools/Logger')

class HighriseCluster extends EventEmitter {
    #validator = new Validator()
    #log = new Logger('HighriseCluster')
    #bots = new Map()

    constructor() {
        super()
        this.setMaxListeners(0)

        const handleShutdown = () => {
            this.#log.warn('HighriseCluster', 'Shutdown signal received. Cleaning up all bots...')
            this.destroyAll()
            process.exit(0)
        }

        process.once("SIGINT", handleShutdown)
        process.once("SIGTERM", handleShutdown)
    }

    destroyAll() {
        for (const { bot } of this.#bots.values()) {
            try {
                bot.destroy()
            } catch (err) {
                this.#log.error('HighriseCluster', `Failed to destroy bot: ${err.message}`)
            }
        }
        
        this.#bots.clear()
    }

    add(token, roomId, options = {}) {
        this.#validator
            .required(token, "token")
            .string(token, "token")
            .required(roomId, "roomId")
            .string(roomId, "roomId")

        if (this.#bots.has(roomId)) {
            this.#log.warn('HighriseCluster', `Bot for room "${roomId}" already exists, skipping.`)
            return this
        }

        const bot = new Highrise(options)

        for (const event of Object.keys(EventToListener)) {
            bot.on(event, (...args) => {
                this.emit(event, bot, ...args)
            })
        }

        this.#bots.set(roomId, { bot, token })
        return this
    }

    login() {
        for (const [roomId, { bot, token }] of this.#bots) {
            bot.login(token, roomId)
        }
        return this
    }

    logout() {
        for (const { bot } of this.#bots.values()) {
            bot.logout()
        }
        return this
    }

    get(roomId) {
        this.#validator
            .required(roomId, "roomId")
            .string(roomId, "roomId")

        return this.#bots.get(roomId)?.bot ?? null
    }

    getAll() {
        return [...this.#bots.values()].map(({ bot }) => bot)
    }

    remove(roomId) {
        this.#validator
            .required(roomId, "roomId")
            .string(roomId, "roomId")

        const entry = this.#bots.get(roomId)
        if (!entry) return false

        entry.bot.destroy()
        this.#bots.delete(roomId)
        return true
    }

    reconnect(roomId) {
        this.#validator
            .required(roomId, "roomId")
            .string(roomId, "roomId")

        const bot = this.get(roomId)
        if (!bot) return false

        bot.reconnect()
        return true
    }

    reconnectAll() {
        for (const { bot } of this.#bots.values()) {
            bot.reconnect()
        }
    }

    get size() {
        return this.#bots.size
    }
}

module.exports = HighriseCluster