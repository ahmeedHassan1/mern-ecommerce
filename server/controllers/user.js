import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/user.js";
import { generateTokens } from "../utils/generateToken.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (!user || !(await user.matchPassword(password))) {
		res.status(401);
		throw new Error("Invalid email or password");
	}

	// Generate both access and refresh tokens
	const { refreshToken } = generateTokens(res, user._id);

	// Store refresh token in database
	await user.addRefreshToken(refreshToken);

	res.status(200).json({
		_id: user._id,
		name: user.name,
		email: user.email,
		isAdmin: user.isAdmin
	});
});

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}

	const user = await User.create({
		name,
		email,
		password
	});

	if (!user) {
		res.status(400);
		throw new Error("Invalid user data");
	}

	// Generate both access and refresh tokens
	const { refreshToken } = generateTokens(res, user._id);

	// Store refresh token in database
	await user.addRefreshToken(refreshToken);

	res.status(201).json({
		_id: user._id,
		name: user.name,
		email: user.email,
		isAdmin: user.isAdmin
	});
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
	const { refreshToken } = req.cookies;

	if (refreshToken && req.user) {
		// Remove this specific refresh token from database
		await req.user.removeRefreshToken(refreshToken);
	}

	// Clear both cookies
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

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}

	res.json({
		_id: user._id,
		name: user.name,
		email: user.email,
		isAdmin: user.isAdmin
	});
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}

	user.name = req.body.name || user.name;
	user.email = req.body.email || user.email;

	if (req.body.password) {
		user.password = req.body.password;
	}

	const updatedUser = await user.save();

	res.status(200).json({
		_id: updatedUser._id,
		name: updatedUser.name,
		email: updatedUser.email,
		isAdmin: updatedUser.isAdmin
	});
});

// @desc    Get users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({});
	res.status(200).json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id).select("-password");

	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}

	res.status(200).json(user);
});

// @desc    Delete users
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}

	if (user.isAdmin) {
		res.status(400);
		throw new Error("Cannot delete admin user");
	}

	await User.deleteOne({ _id: user._id });
	res.status(200).json({ message: "User removed successfully" });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}

	// Only update fields that are provided in the request
	if (req.body.name !== undefined) {
		user.name = req.body.name;
	}
	if (req.body.email !== undefined) {
		user.email = req.body.email;
	}
	if (req.body.isAdmin !== undefined) {
		user.isAdmin = Boolean(req.body.isAdmin);
	}
	if (req.body.password) {
		user.password = req.body.password;
	}

	const updatedUser = await user.save();
	res.status(200).json({
		_id: updatedUser._id,
		name: updatedUser.name,
		email: updatedUser.email,
		isAdmin: updatedUser.isAdmin
	});
});

// @desc    Search users by name or email
// @route   GET /api/users/search
// @access  Private/Admin
const searchUsers = asyncHandler(async (req, res) => {
	const { query = "", limit = 10 } = req.query;

	if (!query.trim()) {
		return res.status(200).json([]);
	}

	const searchRegex = new RegExp(query.trim(), "i");

	const users = await User.find({
		$or: [{ name: searchRegex }, { email: searchRegex }]
	})
		.select("_id name email")
		.limit(parseInt(limit))
		.sort({ name: 1 });

	res.status(200).json(users);
});

// @desc    Get users by IDs
// @route   POST /api/users/by-ids
// @access  Private/Admin
const getUsersByIds = asyncHandler(async (req, res) => {
	const { userIds } = req.body;

	if (!userIds || !Array.isArray(userIds)) {
		res.status(400);
		throw new Error("User IDs array is required");
	}

	const users = await User.find({
		_id: { $in: userIds }
	})
		.select("_id name email")
		.sort({ name: 1 });

	res.status(200).json(users);
});

export {
	authUser,
	registerUser,
	logoutUser,
	getUserProfile,
	updateUserProfile,
	getUsers,
	getUserById,
	deleteUser,
	updateUser,
	searchUsers,
	getUsersByIds
};
