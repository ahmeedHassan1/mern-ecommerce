import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/user.js";
import {
	generateAccessToken,
	verifyRefreshToken
} from "../utils/generateToken.js";

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (but requires valid refresh token)
const refreshToken = asyncHandler(async (req, res) => {
	const { refreshToken: token } = req.cookies;

	if (!token) {
		res.status(401);
		throw new Error("No refresh token provided");
	}

	try {
		// Verify refresh token
		const decoded = verifyRefreshToken(token);

		// Find user and check if refresh token exists
		const user = await User.findById(decoded.userId);

		if (!user) {
			res.status(401);
			throw new Error("User not found");
		}

		// Check if refresh token exists in user's token list
		if (!user.hasValidRefreshToken(token)) {
			res.status(401);
			throw new Error("Invalid refresh token");
		}

		// Generate new access token
		const newAccessToken = generateAccessToken(user._id);

		// Set new access token as cookie
		res.cookie("jwt", newAccessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV !== "development",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000 // 15 minutes
		});

		res.json({
			message: "Token refreshed successfully",
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin
			}
		});
	} catch (error) {
		// Log the error for debugging
		console.error("Refresh token error:", error.message);
		res.status(401);
		throw new Error("Invalid refresh token");
	}
});

// @desc    Logout from current device
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
	const { refreshToken: token } = req.cookies;

	if (token && req.user) {
		// Remove this specific refresh token
		await req.user.removeRefreshToken(token);
	}

	// Clear cookies
	res.cookie("jwt", "", {
		httpOnly: true,
		expires: new Date(0)
	});

	res.cookie("refreshToken", "", {
		httpOnly: true,
		expires: new Date(0)
	});

	res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Logout from all devices
// @route   POST /api/auth/logout-all
// @access  Private
const logoutAll = asyncHandler(async (req, res) => {
	if (req.user) {
		// Remove all refresh tokens
		await req.user.removeAllRefreshTokens();
	}

	// Clear cookies
	res.cookie("jwt", "", {
		httpOnly: true,
		expires: new Date(0)
	});

	res.cookie("refreshToken", "", {
		httpOnly: true,
		expires: new Date(0)
	});

	res.status(200).json({ message: "Logged out from all devices successfully" });
});

// @desc    Get current token info
// @route   GET /api/auth/token-info
// @access  Private
const getTokenInfo = asyncHandler(async (req, res) => {
	const { jwt: accessToken, refreshToken } = req.cookies;

	if (!accessToken && !refreshToken) {
		res.status(401);
		throw new Error("No tokens found");
	}

	const tokenInfo = {
		hasAccessToken: !!accessToken,
		hasRefreshToken: !!refreshToken,
		activeTokens: req.user ? req.user.refreshTokens.length : 0,
		user: req.user
			? {
					_id: req.user._id,
					name: req.user.name,
					email: req.user.email,
					isAdmin: req.user.isAdmin
			  }
			: null
	};

	res.json(tokenInfo);
});

export { refreshToken, logout, logoutAll, getTokenInfo };
