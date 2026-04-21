import RoomsEndpoint from "./Endpoints/rooms"
import UsersEndpoint from "./Endpoints/users"

/**
 * Client for interacting with the Highrise WebApi
 * @see https://create.highrise.game/learn/web-api/general/overview
 */
declare class WebApi {
    /** Represents the Highrise WebApi `/users` endpoint */
    users: UsersEndpoint

    /** Represents the Highrise WebApi `/rooms` endpoint */
    rooms: RoomsEndpoint
}

export default WebApi