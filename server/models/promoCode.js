import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: true
		},
		discount: {
			type: Number,
			required: true
		},
		maxUses: {
			type: Number,
			required: true
		},
		uses: {
			type: Number,
			default: 0
		},
		expiresAt: {
			type: Date,
			required: true
		},
		users: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			}
		]
	},
	{
		timestamps: true
	}
);

promoCodeSchema.methods.checkCode = async function (userId) {
	const error = new Error();

	if (this.uses >= this.maxUses) {
		error.message = "Promo code has been used up";
		error.status = 400;
		throw error;
	}

	if (this.expiresAt < new Date()) {
		error.message = "Promo code has expired";
		error.status = 400;
		throw error;
	}

	if (this.users.length > 0 && !this.users.includes(userId)) {
		error.message = "You are not eligible to use this promo code";
		error.status = 400;
		throw error;
	}

	return this;
};

// Indexes for performance optimization
promoCodeSchema.index({ code: 1 }, { unique: true }); // Fast code lookups
promoCodeSchema.index({ expiresAt: 1 }); // For expiry checks
promoCodeSchema.index({ uses: 1, maxUses: 1 }); // For usage validation
promoCodeSchema.index({ users: 1 }); // For user eligibility

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

export default PromoCode;
