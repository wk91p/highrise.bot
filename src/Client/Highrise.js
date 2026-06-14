const HighriseCore = require("./HighriseCore");

const EmoteLoop = require("../Tools/EmoteLooper");
const EmotesManager = require("../Tools/EmotesManager");
const CommandManager = require("../Tools/CommandManager");

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
        this.looper = new EmoteLoop(this.player, this.utils.emotes)
        this.emotes = new EmotesManager()

        if (this.#options?.commandManager) {
            this.command = new CommandManager(this.#options.commandManager.folderPath)
        } else {
            this.command = null
        }
    }
}

module.exports = Highrise