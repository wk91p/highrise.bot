const Validator = require("../Utils/Validator")

class BotContext {
    constructor(sender, logger, state) {
        this.sender = sender
        this.logger = logger
        this.state = state
        this.validator = new Validator
    }
}

module.exports = BotContext