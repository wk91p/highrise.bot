const HighriseCore = require("./HighriseCore");

const EmoteLoop = require("../Tools/EmoteLooper");
const EmotesManager = require("../Tools/EmotesManager");

class Highrise extends HighriseCore {
    #options
    constructor(options) {
        super(options)

        this.#options = options
    }

    login(token, roomId) {
        super.login(token, roomId)

        this.#setupApi()

    }

    #setupApi() {
        this.emotes = new EmotesManager()
        this.looper = new EmoteLoop(this.player, this.emotes)
    }
}

module.exports = Highrise