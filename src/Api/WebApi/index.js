const HttpClient = require("../../Networking/Core/HttpClient");
const UsersEndpoint = require("./Endpoints/Users");

class WebApi {
    #client

    constructor(ctx) {
        this.#client = new HttpClient({
            baseURL: "https://webapi.highrise.game"
        })

        this.users = new UsersEndpoint(ctx, this.#client)
    }
}

module.exports = WebApi