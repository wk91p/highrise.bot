import UsersEndpoint from "./Endpoints/users"

/**
 * Client for interacting with the Highrise WebApi
 * @see https://create.highrise.game/learn/web-api/general/overview
 */
class WebApi {
    /** Represents the Highrise WebApi `/users` endpoint */
    users: UsersEndpoint
}

export default WebApi