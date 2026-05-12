const HighriseCore = require("./HighriseCore");

const EmoteLoop = require("../Tools/EmoteLooper");

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
    }
}

module.exports = Highrise