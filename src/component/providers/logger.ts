import pino from "pino";
import 'dotenv/config'
import Constants from "../config/constants"

const logger = pino({
    // Base configuration
    base: {
        env: Constants.NODE_ENV,
        app: "NYC_REAL_ESTATE_MONITOR"
    }, // Remove default "pid" and "hostname"

    // Set log level (default: 'info')
    level: Constants.NODE_ENV === 'production' ? 'info' : 'debug',

    // Pretty printing in development
    transport: Constants.NODE_ENV === 'development' ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname'
        }
    } : undefined,

    // Custom formatters
    formatters: {
        level: (label) => ({ level: label.toUpperCase() })
    },

    // Redact sensitive information
    redact: ['password', 'token', '*.secret']
});

export default logger