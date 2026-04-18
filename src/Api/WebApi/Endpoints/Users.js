const UserResponse = require("../../../Models/ResponseModels/WebApiResponses/UsersResponses")

class UsersEndpoint {
    constructor(ctx, client) {
        this.client = client
        this.validator = ctx.validator
    }

    async get(identifier) {
        try {
            this.validator
                .required(identifier, "identifier")
                .string(identifier, "identifier")

            const res = await this.client.get(`/users/${identifier}`)
            return new UserResponse(res.user)
        } catch (error) {
            return new UserResponse({ error: new Error(error.response.data) })
        }
    }
}

module.exports = UsersEndpoint