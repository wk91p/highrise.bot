class BotContext {
    constructor(sender, logger, state, validator, configs) {
        this.sender = sender
        this.logger = logger
        this.state = state
        this.validator = validator
        this.configs = {}

        for (const config of configs) {
            const name = config.constructor.staticName
            if (!name) throw new Error(`${config.constructor.name} must have a static staticName set`)
           
            this.configs[name] = config
        }
    }
}

module.exports = BotContext