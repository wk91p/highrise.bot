declare class Logger {
    
    constructor(
        /**
         * name for the logger prefix the default SDK prefix is `"Highrise"` prefix
         */
        prefix: string
    );

    /**
     * Log an informational message
     * @param category - The category or context of the log
     * @param args - Additional messages or objects to log
     * @example
     * logger.info("Websocket", "Connected to Highrise!")
     */
    info(category: string, ...args: unknown[]): void;

    /**
     * Log a warning message
     * @param category - The category or context of the log
     * @param args - Additional messages or objects to log
     * @example
     * logger.warn("Websocket", "Connection is slow")
     */
    warn(category: string, ...args: unknown[]): void;

    /**
     * Log an error message
     * @param category - The category or context of the log
     * @param args - Additional messages or objects to log
     * @example
     * logger.error("Websocket", "Failed to send payload", { rid })
     */
    error(category: string, ...args: unknown[]): void;

    /**
     * Log a debug message
     * @param category - The category or context of the log
     * @param args - Additional messages or objects to log
     * @example
     * logger.debug("Closing", `code: ${code}`, `reason: ${reason}`)
     */
    debug(category: string, ...args: unknown[]): void;
}

export { Logger }
export default Logger