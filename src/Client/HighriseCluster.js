const EventEmitter = require('node:events')
const Highrise = require('./Highrise')
const { EventToListener } = require('../Constants/WebsocketConstants')

class HighriseCluster extends EventEmitter {
    #bots = new Map()

    constructor() {
        super()
        this.setMaxListeners(0)
    }

    add(token, roomId, options = {}) {
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
        return this.#bots.get(roomId)?.bot ?? null
    }

    getAll() {
        return [...this.#bots.values()].map(({ bot }) => bot)
    }

    remove(roomId) {
        const entry = this.#bots.get(roomId)
        if (!entry) return false

        entry.bot.logout()
        this.#bots.delete(roomId)
        return true
    }

    reconnect(roomId) {
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