import Highrise from '../Highrise'
import { EventMap } from '../Highrise/EventMap'

declare class HighriseCluster {
    /**
     * The number of bots currently in the cluster.
     */
    get size(): number

    /**
     * Adds a bot to the cluster and registers all event listeners.
     * @param token The authentication token for the bot.
     * @param roomId The room ID the bot will connect to.
     * @param options Optional configuration options for the bot.
     * @returns The cluster instance for chaining.
     */
    add(token: string, roomId: string, options?: LoginOptions): this

    /**
     * Starts all bots in the cluster by calling `login()` on each one.
     * @returns The cluster instance for chaining.
     */
    login(): this

    /**
     * Disconnects all bots in the cluster.
     * @returns The cluster instance for chaining.
     */
    logout(): this

    /**
     * Retrieves a specific bot by room ID.
     * @param roomId The room ID of the bot to retrieve.
     * @returns The bot instance, or `null` if not found.
     */
    get(roomId: string): Highrise | null

    /**
     * Returns all bot instances in the cluster.
     */
    getAll(): Highrise[]

    /**
     * Removes a bot from the cluster and disconnects it.
     * @param roomId The room ID of the bot to remove.
     * @returns `true` if removed successfully, `false` if not found.
     */
    remove(roomId: string): boolean

    /**
     * Reconnects a specific bot by room ID.
     * @param roomId The room ID of the bot to reconnect.
     * @returns `true` if reconnected successfully, `false` if not found.
     */
    reconnect(roomId: string): boolean

    /**
     * Reconnects all bots in the cluster.
     */
    reconnectAll(): void

    on<K extends keyof EventMap>(event: K, listener: (bot: Highrise, ...args: EventMap[K]) => Promise<void>): this
    on(event: string, listener: (bot: Highrise, ...args: any[]) => Promise<void>): this

    once<K extends keyof EventMap>(event: K, listener: (bot: Highrise, ...args: EventMap[K]) => Promise<void>): this
    once(event: string, listener: (bot: Highrise, ...args: any[]) => Promise<void>): this

    off<K extends keyof EventMap>(event: K, listener: (bot: Highrise, ...args: EventMap[K]) => void | Promise<void>): this
    off(event: string, listener: (bot: Highrise, ...args: any[]) => void | Promise<void>): this

    emit<K extends keyof EventMap>(event: K, bot: Highrise, ...args: EventMap[K]): boolean
    emit(event: string, bot: Highrise, ...args: any[]): boolean
}

export default HighriseCluster