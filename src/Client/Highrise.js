const HighriseCore = require("./HighriseCore");

const EmoteLoop = require("../Tools/EmoteLooper");
const EmotesManager = require("../Tools/EmotesManager");

class Highrise extends HighriseCore {
    #options
    constructor(options) {
        super(options)

        this.#options = options

        process.once("SIGINT", () => { this.#classesCleanup(); process.exit() })
        process.once("SIGTERM", () => { this.#classesCleanup(); process.exit() })
        process.once("exit", this.#classesCleanup.bind(this))
    }
    
    login(token, roomId) {
        super.login(token, roomId)

        this.#setupApi()
    }

    #setupApi() {
        this.emotes = new EmotesManager()
        this.looper = new EmoteLoop(this.player, this.emotes)
    }

    #classesCleanup() {
        this.roles.destroy()
        this.emotes.destroy()
    }
}

module.exports = Highrise