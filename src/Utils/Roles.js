const fs = require("fs")

class Roles {
    #roles = new Map()
    #state
    #logger
    #webapi
    #persistPath

    constructor(ctx, webapi) {
        this.#state = ctx.state
        this.#logger = ctx.logger
        this.#webapi = webapi
        this.#persistPath = ctx.configs.roles.persistPath ?? null

        this.#init()

        const save = () => {
            if (this.#persistPath) this.#saveToFile()
        }

        process.once("SIGINT", () => { save(); process.exit() })
        process.once("SIGTERM", () => { save(); process.exit() })
        process.once("exit", save)
    }

    async #init() {
        await this.#fetchAndSync()
        if (this.#persistPath) {
            this.#loadFromFile()
            this.#saveToFile()
            this.#startSaveInterval()
        }
        this.#startInterval()
    }

    #loadFromFile() {
        try {
            if (!fs.existsSync(this.#persistPath)) return

            const raw = fs.readFileSync(this.#persistPath, "utf-8")
            const saved = JSON.parse(raw)

            for (const [role, users] of Object.entries(saved)) {
                if (this.#roles.has(role)) {
                    const existing = this.#roles.get(role)
                    const merged = [...new Set([...existing, ...users])]
                    this.#roles.set(role, merged)
                } else {
                    this.#roles.set(role, users)
                }
            }

            this.#logger.info("Roles", "Roles loaded from file.")
        } catch (err) {
            this.#logger.warn("Roles", `Failed to load roles from file: ${err.message}`)
        }
    }

    #saveToFile() {
        try {
            const serialized = Object.fromEntries(this.#roles)
            fs.writeFileSync(this.#persistPath, JSON.stringify(serialized, null, 2), "utf-8")
        } catch (err) {
            this.#logger.warn("Roles", `Failed to save roles to file: ${err.message}`)
        }
    }

    #startSaveInterval() {
        const interval = setInterval(() => {
            this.#logger.info("Roles", "Saving roles to file...")
            this.#saveToFile()
        }, 7.5 * 60 * 1000)

        this.#state.get("intervals").push(interval)
    }

    #startInterval() {
        const interval = setInterval(async () => {
            this.#logger.info("Roles", "Refreshing room roles...")
            await this.#fetchAndSync()
            if (this.#persistPath) this.#loadFromFile()
        }, 10 * 60 * 1000)

        this.#state.get("intervals").push(interval)
    }

    async #fetchAndSync() {
        const room = await this.#fetchRoom()
        if (!room) return

        const moderatorIds = room.moderatorIds

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
            return true
        } else {
            return false
        }
    }

    removeRole(userId, role) {
        const users = this.#roles.get(role)
        if (!users) return false
        this.#roles.set(role, users.filter(id => id !== userId))

        return true
    }

    getRoles(userId) {
        return [...this.#roles.entries()]
            .filter(([, users]) => users.includes(userId))
            .map(([role]) => role)
    }

    setRoles(userId, roles) {
        this.clearRoles(userId)
        roles.forEach(role => this.addRole(userId, role))

        return true
    }

    clearRoles(userId) {
        for (const [role, users] of this.#roles) {
            this.#roles.set(role, users.filter(id => id !== userId))
        }

        return true
    }

    isOwner(userId) {
        return this.hasRole(userId, "owner")
    }

    isModerator(userId) {
        return this.hasRole(userId, "mod")
    }
}

module.exports = Roles