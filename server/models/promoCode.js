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

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

export default PromoCode;
