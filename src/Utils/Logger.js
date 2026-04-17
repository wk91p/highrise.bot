const ANSI = {
    reset:   '\x1b[0m',
    cyan:    '\x1b[36m',
    yellow:  '\x1b[33m',
    red:     '\x1b[31m',
    gray:    '\x1b[90m',
    white:   '\x1b[37m',
    bold:    '\x1b[1m',
    magenta: '\x1b[35m'
}

const LEVELS = {
    info:  { color: ANSI.cyan,    label: '[INFO]'  },
    warn:  { color: ANSI.yellow,  label: '[WARN]'  },
    error: { color: ANSI.red,     label: '[ERROR]' },
    debug: { color: ANSI.magenta, label: '[DEBUG]' },
}

const gray = (str) => `${ANSI.gray}${str}${ANSI.reset}`

class Logger {
    constructor(options = {}) {
        this.prefix = options.prefix || 'Highrise'
    }

    #time() {
        return new Date().toTimeString().slice(0, 8)
    }

    #getLocation() {
        const stack = new Error().stack?.split('\n')
        const caller = stack?.[4]
        if (!caller) return null
        const match = caller.match(/\((.+)\)$/) || caller.match(/at (.+)$/)
        return match?.[1] ?? null
    }

    #log(level, category, ...args) {
        const { color, label } = LEVELS[level]

        const prefix = `${ANSI.bold}${ANSI.white}[${this.prefix}]${ANSI.reset}`
        const sep    = gray('│')
        const time   = gray(this.#time())
        const lvl    = `${color}${label}${ANSI.reset}`
        const cat    = `${color}${category}${ANSI.reset}`
        const msg    = args
            .map(a => typeof a === 'object' ? JSON.stringify(a) : a)
            .join(` ${gray('·')} `)

        const loc = level === 'debug'
            ? `\n${gray(`↳ ${this.#getLocation()}`)}\n`
            : ''

        console.log(
            `${prefix} ${sep} ${time} ${sep} ${lvl} ${sep} ${cat}`,
            msg ? `${sep} ${msg}${loc}` : loc
        )
    }

    info(category, ...args)  { this.#log('info',  category, ...args) }
    warn(category, ...args)  { this.#log('warn',  category, ...args) }
    error(category, ...args) { this.#log('error', category, ...args) }
    debug(category, ...args) { this.#log('debug', category, ...args) }
}

module.exports = Logger