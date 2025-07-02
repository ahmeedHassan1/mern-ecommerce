import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User"
		},
		orderItems: [
			{
				name: { type: String, required: true },
				qty: { type: Number, required: true },
				image: { type: String, required: true },
				price: { type: Number, required: true },
				product: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: "Product"
				}
			}
		],
		shippingAddress: {
			address: { type: String, required: true },
			city: { type: String, required: true },
			postalCode: { type: String, required: true },
			country: { type: String, required: true }
		},
		paymentMethod: {
			type: String,
			required: true
		},
		paymentResult: {
			id: { type: String },
			status: { type: String },
			update_time: { type: String },
			email_address: { type: String }
		},
		itemsPrice: {
			type: Number,
			required: true,
			default: 0.0
		},
		taxPrice: {
			type: Number,
			required: true,
			default: 0.0
		},
		shippingPrice: {
			type: Number,
			required: true,
			default: 0.0
		},
		totalPrice: {
			type: Number,
			required: true,
			default: 0.0
		},
		isPaid: {
			type: Boolean,
			required: true,
			default: false
		},
		paidAt: {
			type: Date
		},
		isDelivered: {
			type: Boolean,
			required: true,
			default: false
		},
		deliveredAt: {
			type: Date
		}
	},
	{ timestamps: true }
);

// Indexes for performance optimization
orderSchema.index({ user: 1 }); // For user's orders queries
orderSchema.index({ isPaid: 1 }); // For payment status filtering
orderSchema.index({ isDelivered: 1 }); // For delivery status filtering
orderSchema.index({ paymentMethod: 1 }); // For payment method filtering
orderSchema.index({ createdAt: -1 }); // For recent orders
orderSchema.index({ totalPrice: -1 }); // For high-value orders

// Compound indexes for complex queries
orderSchema.index({ user: 1, createdAt: -1 }); // User's recent orders
orderSchema.index({ isPaid: 1, isDelivered: 1 }); // Order status combinations
orderSchema.index({ user: 1, isPaid: 1 }); // User's paid orders

const Order = mongoose.model("Order", orderSchema);

export default Order;
