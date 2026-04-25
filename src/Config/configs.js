const BaseConfig = require("../Base/BaseConfig")

class RolesConfig extends BaseConfig {
    static staticName = "roles"

    setup(options = {}) {
        if (options.persistPath !== undefined) {
            this.validator.string(options.persistPath, "roles.persistPath")
        }

        this.persistPath = options.persistPath ?? null

        return this
    }
}

module.exports = { RolesConfig }