const winston = require('winston');

const { combine, timestamp, printf, colorize, align } = winston.format;

// Custom log format to create a clean, timestamped output.
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  // The default log level. Can be overridden by the LOG_LEVEL environment variable.
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    // Colorizes the log level for better readability in the console.
    colorize(),
    // Adds a timestamp to each log entry.
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    // Aligns the log messages.
    align(),
    // Applies the custom log format.
    logFormat
  ),
  // Define where the logs should be sent. For now, just the console.
  transports: [
    new winston.transports.Console(),
  ],
  // Do not exit on handled exceptions.
  exitOnError: false,
});

// A simple stream object with a 'write' function that will be used by morgan.
logger.stream = {
  write: (message) => {
    // Morgan adds a newline character that we can strip.
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

module.exports = logger;
