class BotContext {
    constructor(sender, logger, state, validator, configs) {
        this.sender = sender
        this.logger = logger
        this.state = state
        this.validator = validator
        this.configs = {}

        for (const config of configs) {
            const name = config.constructor.staticName
            if (!name) this.logger.warn(`BotContext`, `${config.constructor.name} must have static staticName set`)
                
            this.configs[name] = config
        }
    }
}

module.exports = BotContext