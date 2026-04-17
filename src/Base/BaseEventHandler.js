class BaseEventHandler {
    constructor(ctx) {
        this.logger = ctx.logger
        this.state = ctx.state
        this.metrics = null // TODO: impl a default metric class
    }

    async handle(data, emit) {
        throw new Error(`${this.constructor.name} must implement handle()`)
    }
}

module.exports = BaseEventHandler