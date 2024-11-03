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
			required: true,
			validate: {
				validator: function (value) {
					return value > Date.now();
				},
				message: "Expiry date must be in the future."
			}
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

promoCodeSchema.methods.checkCode = async function (code, userId) {
	const error = new Error();
	const promoCode = await PromoCode.findOne({ code });

	if (!promoCode) {
		error.message = "Invalid promo code";
		error.status = 404;
		throw error;
	}

	if (promoCode.maxUses <= promoCode.uses) {
		error.message = "Promo code has been used up";
		error.status = 400;
		throw error;
	}

	if (promoCode.expiresAt < new Date()) {
		error.message = "Promo code has expired";
		error.status = 400;
		throw error;
	}

	if (promoCode.users.length > 0 && !promoCode.users.includes(userId)) {
		error.message = "You are not eligible to use this promo code";
		error.status = 400;
		throw error;
	}

	return promoCode;
};

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

export default PromoCode;
