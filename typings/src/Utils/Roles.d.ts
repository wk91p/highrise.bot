declare class Roles {

    /**
     * Checks if a user has a specific role.
     * @param userId The unique identifier of the user.
     * @param role The role to check for.
     */
    hasRole(userId: string, role: string): boolean

    /**
     * Checks if a user has at least one of the specified roles.
     * @param userId The unique identifier of the user.
     * @param roles The list of roles to check against.
     */
    hasAnyRole(userId: string, roles: string[]): boolean

    /**
     * Checks if a user has all of the specified roles.
     * @param userId The unique identifier of the user.
     * @param roles The list of roles to check against.
     */
    hasAllRoles(userId: string, roles: string[]): boolean

    /**
     * Assigns a role to a user.
     * @param userId The unique identifier of the user.
     * @param role The role to assign.
     */
    addRole(userId: string, role: string): void

    /**
     * Removes a role from a user.
     * @param userId The unique identifier of the user.
     * @param role The role to remove.
     */
    removeRole(userId: string, role: string): void

    /**
     * Returns all roles assigned to a user.
     * @param userId The unique identifier of the user.
     */
    getRoles(userId: string): string[]

    /**
     * Replaces all roles of a user with the specified roles.
     * @param userId The unique identifier of the user.
     * @param roles The new list of roles to assign.
     */
    setRoles(userId: string, roles: string[]): void

    /**
     * Removes all roles from a user.
     * @param userId The unique identifier of the user.
     */
    clearRoles(userId: string): void

    /**
     * Checks if a user is the room owner.
     * @param userId The unique identifier of the user.
     */
    isOwner(userId: string): boolean

    /**
     * Checks if a user is a moderator.
     * @param userId The unique identifier of the user.
     */
    isModerator(userId: string): boolean
}

export { Roles }