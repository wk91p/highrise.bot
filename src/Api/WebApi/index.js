const HttpClient = require("../../Networking/Core/HttpClient");
const RoomsEndpoint = require("./Endpoints/Rooms");
const UsersEndpoint = require("./Endpoints/Users");

class WebApi {
    #client

    constructor(ctx) {
        this.#client = new HttpClient({
            baseURL: "https://webapi.highrise.game"
        })

        this.users = new UsersEndpoint(ctx, this.#client)
        this.rooms = new RoomsEndpoint(ctx, this.#client)
    }
}

module.exports = WebApi