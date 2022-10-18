const appRoot = require('app-root-path');
const winston = require('winston');

const logFormat = winston.format.printf(function(info) {
    return `${info.timestamp} | ${info.level}\t|| ${info.message}`;
});
const options = {
    file: {
        level: "debug",
        filename: `${appRoot}/logs/central-socket-server.log`,
        handleExceptions: true,
        maxsize: 100*1024*1024,
        maxFiles: 10,
        format: winston.format.combine(
            winston.format.timestamp(),
            logFormat
        )
    },
    console: {
        level: "info",
        handleExceptions: true,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            logFormat
        )
    }
}

const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false
})

logger.stream = {
    write: function (message, _encoding) {
        // use the 'info' log level so the output will be picked up by both
        // transports (file and console)
        logger.info(message);
    }
};

module.exports = logger;