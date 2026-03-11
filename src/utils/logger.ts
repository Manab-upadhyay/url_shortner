import winston from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize, json } = winston.format;

// Custom format for terminal output (development)
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `[${timestamp}] ${level}: ${message}`;
  if (Object.keys(metadata).length > 0 && metadata.constructor === Object) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

const isProduction = process.env.NODE_ENV === "production";

const transports: winston.transport[] = [];

if (isProduction) {
  transports.push(
    new winston.transports.DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "error",
      format: combine(timestamp(), json()),
    }),
    new winston.transports.DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: combine(timestamp(), json()),
    }),
    new winston.transports.Console({
      format: combine(timestamp(), json()),
    })
  );
} else {
  // In development, log to console with colors and simple format
  transports.push(
    new winston.transports.Console({
      format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    })
  );
}

const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  transports,
});

// Create a stream object for Morgan integration
export const stream = {
  write: (message: string) => {
    // Morgan adds a newline character to the end of the message, remove it
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export default logger;
