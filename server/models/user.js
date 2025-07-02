import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true
		},
		password: {
			type: String,
			required: true
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false
		},
		refreshTokens: [
			{
				token: {
					type: String,
					required: true
				},
				createdAt: {
					type: Date,
					default: Date.now,
					expires: 604800 // 7 days in seconds
				}
			}
		]
	},
	{
		timestamps: true
	}
);

// Indexes for performance optimization
userSchema.index({ email: 1 }); // Already unique, but optimize for queries
userSchema.index({ isAdmin: 1 }); // For admin queries
userSchema.index({ createdAt: -1 }); // For recent users

userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// Add refresh token to user
userSchema.methods.addRefreshToken = async function (refreshToken) {
	// Remove old tokens (keep only last 5 tokens per user)
	if (this.refreshTokens.length >= 5) {
		this.refreshTokens = this.refreshTokens.slice(-4);
	}

	this.refreshTokens.push({ token: refreshToken });
	await this.save();
};

// Remove refresh token from user
userSchema.methods.removeRefreshToken = async function (refreshToken) {
	this.refreshTokens = this.refreshTokens.filter(
		(tokenObj) => tokenObj.token !== refreshToken
	);
	await this.save();
};

// Remove all refresh tokens (for logout all devices)
userSchema.methods.removeAllRefreshTokens = async function () {
	this.refreshTokens = [];
	await this.save();
};

// Check if refresh token exists and is valid
userSchema.methods.hasValidRefreshToken = function (refreshToken) {
	return this.refreshTokens.some((tokenObj) => tokenObj.token === refreshToken);
};

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
