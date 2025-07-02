import winston from "winston";
import path from "path";

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), "logs");

// Define log format
const logFormat = combine(
	timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	errors({ stack: true }),
	json()
);

// Create the logger
const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || "info",
	format: logFormat,
	defaultMeta: { service: "mern-ecommerce" },
	transports: [
		// Write all logs with importance level of 'error' or less to error.log
		new winston.transports.File({
			filename: path.join(logsDir, "error.log"),
			level: "error"
		}),
		// Write all logs with importance level of 'info' or less to combined.log
		new winston.transports.File({
			filename: path.join(logsDir, "combined.log")
		})
	]
});

// If we're not in production, log to the console with a simple format
if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: combine(colorize(), simple())
		})
	);
}

export default logger;
