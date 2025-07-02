import rateLimit from "express-rate-limit";

// Rate limiting for login attempts
export const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // Limit each IP to 5 requests per windowMs
	message: {
		error: "Too many login attempts, please try again later."
	},
	standardHeaders: true,
	legacyHeaders: false,
	// Only count failed requests
	skipSuccessfulRequests: true
});

// General API rate limiting
export const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: process.env.NODE_ENV === "production" ? 200 : 500, // Higher limit for development
	message: {
		error: "Too many requests, please try again later."
	},
	standardHeaders: true,
	legacyHeaders: false
});

// Strict rate limiting for password reset or sensitive operations
export const strictLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 3, // Limit each IP to 3 requests per hour
	message: {
		error: "Too many requests for this operation, please try again later."
	},
	standardHeaders: true,
	legacyHeaders: false
});
