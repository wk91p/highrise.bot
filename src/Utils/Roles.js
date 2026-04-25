class Roles {
    #roles = new Map()
    #state
    #logger
    #webapi

    constructor(ctx, webapi) {
        this.#state = ctx.state
        this.#logger = ctx.logger
        this.#webapi = webapi

        this.#init()
    }

    async #init() {
        await this.#fetchAndSync()
        this.#startInterval()
    }

    #startInterval() {
        const interval = setInterval(async () => {
            this.#logger.info("Roles", "Refreshing room roles...")
            await this.#fetchAndSync()
        }, 10 * 60 * 1000)

        this.#state.get("intervals").push(interval)
    }

    async #fetchAndSync() {
        const room = await this.#fetchRoom()
        if (!room) return

        const moderatorIds = [...room.moderatorIds, room.ownerId]

        this.#roles.set("owner", [room.ownerId])
        this.#roles.set("mod", moderatorIds)
    }

    async #fetchRoom() {
        const { roomId } = this.#state.get("credential")
        if (!roomId) {
            this.#logger.warn("Roles", "No room ID found in credentials. Skipping role initialization.")
            return null
        }

        const room = await this.#webapi.rooms.get(roomId)
        if (!room.ok) {
            this.#logger.warn("Roles", `Failed to fetch room data for room ID ${roomId} (${room.error}), Skipping role initialization.`)
            return null
        }

        return room
    }

    hasRole(userId, role) {
        return this.#roles.get(role)?.includes(userId) ?? false
    }

    hasAnyRole(userId, roles) {
        return roles.some(role => this.hasRole(userId, role))
    }

    hasAllRoles(userId, roles) {
        return roles.every(role => this.hasRole(userId, role))
    }

    addRole(userId, role) {
        if (!this.#roles.has(role)) {
            this.#roles.set(role, [])
        }
        const users = this.#roles.get(role)
        if (!users.includes(userId)) {
            users.push(userId)
        }
    }

    removeRole(userId, role) {
        const users = this.#roles.get(role)
        if (!users) return
        this.#roles.set(role, users.filter(id => id !== userId))
    }

    getRoles(userId) {
        return [...this.#roles.entries()]
            .filter(([, users]) => users.includes(userId))
            .map(([role]) => role)
    }

    setRoles(userId, roles) {
        this.clearRoles(userId)
        roles.forEach(role => this.addRole(userId, role))
    }

    clearRoles(userId) {
        for (const [role, users] of this.#roles) {
            this.#roles.set(role, users.filter(id => id !== userId))
        }
    }

    isOwner(userId) {
        return this.hasRole(userId, "owner")
    }

    isModerator(userId) {
        return this.hasRole(userId, "mod")
    }
}

module.exports = Roles