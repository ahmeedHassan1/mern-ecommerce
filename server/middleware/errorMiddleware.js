import logger from "../utils/logger.js";

const notFound = (req, res, next) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(404);
	logger.warn(
		`404 - Not Found: ${req.method} ${req.originalUrl} - IP: ${req.ip}`
	);
	next(error);
};

const errorHandler = (error, req, res, next) => {
	let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	let message = error.message || "Internal Server Error";

	// Log the error
	logger.error({
		message: error.message,
		stack: error.stack,
		url: req.originalUrl,
		method: req.method,
		ip: req.ip,
		userAgent: req.get("User-Agent"),
		userId: req.user?._id,
		statusCode
	});

	// Check for Mongoose bad ObjectId
	if (error.name === "CastError" && error.kind === "ObjectId") {
		message = "Resource not found";
		statusCode = 404;
	}

	// Check for Mongoose duplicate key error
	if (error.code === 11000) {
		const field = Object.keys(error.keyValue)[0];
		message = `Duplicate ${field}: ${error.keyValue[field]} already exists`;
		statusCode = 400;
	}

	// Check for Mongoose validation error
	if (error.name === "ValidationError") {
		const errors = Object.values(error.errors).map((err) => err.message);
		message = errors.join(", ");
		statusCode = 400;
	}

	res.status(statusCode).json({
		message,
		stack: process.env.NODE_ENV === "production" ? null : error.stack
	});
};

export { notFound, errorHandler };
