class OpenHandler {
    constructor(ctx, keepaliveHandler) {
        this.logger = ctx.logger
        this.state = ctx.state
        this.sender = ctx.sender
        this.keepaliveHandler = keepaliveHandler
    }

    async handle() {
        try {
            this.logger.info("Connected to Highrise Bot Server")
            this.keepaliveHandler.start()

            this.state.set("connectTime", Date.now())
        } catch (error) {
            this.logger.error(error)
        }
    }
}

module.exports = OpenHandler