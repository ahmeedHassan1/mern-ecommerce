import asyncHandler from "../middleware/asyncHandler.js";

import Product from "../models/product.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
	const products = await Product.find();
	res.json(products);
});

// @desc    Fetch a product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (!product) {
		res.status(404);
		throw new Error("Resource not found");
	}
	res.json(product);
});

export { getProducts, getProductById };