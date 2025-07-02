import jwt from "jsonwebtoken";

const generateTokens = (res, userId) => {
	// Generate access token (short-lived)
	const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15m" // 15 minutes
	});

	// Generate refresh token (long-lived)
	const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: "7d" // 7 days
	});

	// Set access token as HTTP-only cookie
	res.cookie("jwt", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV !== "development",
		sameSite: "strict",
		maxAge: 15 * 60 * 1000 // 15 minutes
	});

	// Set refresh token as HTTP-only cookie
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV !== "development",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
	});

	return { accessToken, refreshToken };
};

// Legacy function for backward compatibility
const generateToken = (res, userId) => {
	return generateTokens(res, userId);
};

// Function to generate only access token
const generateAccessToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15m"
	});
};

// Function to generate only refresh token
const generateRefreshToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: "7d"
	});
};

// Function to verify refresh token
const verifyRefreshToken = (token) => {
	return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

export default generateToken;
export {
	generateTokens,
	generateAccessToken,
	generateRefreshToken,
	verifyRefreshToken
};
