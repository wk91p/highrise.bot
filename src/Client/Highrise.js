const HighriseCore = require("./HighriseCore");

const EmoteLoop = require("../Tools/EmoteLooper");
const EmotesManager = require("../Tools/EmotesManager");

class Highrise extends HighriseCore {
    constructor(options) {
        super(options)
    }

    login(token, roomId) {
        super.login(token, roomId)

        this.#setupApi()
        
    }

    #setupApi() {
        this.looper = new EmoteLoop(this.player, this.utils.emotes)
        this.emotes = new EmotesManager()
    }
}

module.exports = Highrise