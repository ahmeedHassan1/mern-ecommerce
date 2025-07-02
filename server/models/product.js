import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User"
		},
		name: {
			type: String,
			required: true
		},
		rating: {
			type: Number,
			required: true
		},
		comment: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);

const productSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User"
		},
		name: {
			type: String,
			required: true
		},
		image: {
			type: String,
			required: true
		},
		brand: {
			type: String,
			required: true
		},
		category: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		reviews: [reviewSchema],
		rating: {
			type: Number,
			required: true,
			default: 0
		},
		numReviews: {
			type: Number,
			required: true,
			default: 0
		},
		price: {
			type: Number,
			required: true,
			default: 0
		},
		countInStock: {
			type: Number,
			required: true,
			default: 0
		}
	},
	{
		timestamps: true
	}
);

// Indexes for performance optimization
productSchema.index({ name: "text" }); // Text search for product names
productSchema.index({ rating: -1 }); // For top-rated products (descending)
productSchema.index({ category: 1 }); // For category filtering
productSchema.index({ brand: 1 }); // For brand filtering
productSchema.index({ price: 1 }); // For price sorting
productSchema.index({ countInStock: 1 }); // For stock availability
productSchema.index({ user: 1 }); // For admin queries by creator
productSchema.index({ createdAt: -1 }); // For newest products

// Compound indexes for complex queries
productSchema.index({ category: 1, rating: -1 }); // Category + rating
productSchema.index({ brand: 1, price: 1 }); // Brand + price
productSchema.index({ countInStock: 1, rating: -1 }); // Available + popular

const Product = mongoose.model("Product", productSchema);

export default Product;
