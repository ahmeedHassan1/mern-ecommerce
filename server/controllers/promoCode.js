import asyncHandler from "../middleware/asyncHandler.js";

import PromoCode from "../models/promoCode.js";

// @desc    Get all promo codes
// @route   GET /api/promos
// @access  Private/Admin
const getPromoCodes = asyncHandler(async (req, res) => {
	const promoCodes = await PromoCode.find();

	res.status(200).json(promoCodes);
});

// @desc    Get a promo code
// @route   GET /api/promos/:id
// @access  Private/Admin
const getPromoCode = asyncHandler(async (req, res) => {
	const promoCode = await PromoCode.findById(req.params.id);

	if (!promoCode) {
		res.status(404);
		throw new Error("Promo code not found");
	}

	res.status(200).json(promoCode);
});

// @desc    Create a promo code
// @route   POST /api/promos
// @access  Private/Admin
const createPromoCode = asyncHandler(async (req, res) => {
	const promo = new PromoCode({
		code: "PROMO",
		discount: 0,
		maxUses: 100,
		expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
		users: []
	});

	const createdPromo = await promo.save();
	res.status(201).json(createdPromo);
});

// @desc    Check if a promo code is valid
// @route   POST /api/promos/check
// @access  Private
const checkPromoCode = asyncHandler(async (req, res) => {
	const { code } = req.body;
	const promoCode = await PromoCode.findOne({ code });

	if (!promoCode) {
		res.status(404);
		throw new Error("Invalid promo code");
	}

	try {
		await promoCode.checkCode(req.user._id);
		res
			.status(200)
			.json({ message: "Promo code is valid", discount: promoCode.discount });
	} catch (error) {
		res.status(error.status || 500);
		throw new Error(error.message);
	}
});

// @desc    Use a promo code
// @route   POST /api/promos/use
// @access  Private
const usePromoCode = asyncHandler(async (req, res) => {
	const { code } = req.body;
	const promoCode = await PromoCode.findOne({ code });

	if (!promoCode) {
		res.status(404);
		throw new Error("Promo code not found");
	}

	try {
		await promoCode.checkCode(req.user._id);
		promoCode.uses += 1;
		await promoCode.save();
		res.status(200).json({ message: "Promo code used" });
	} catch (error) {
		res.status(error.status || 500);
		throw new Error(error.message);
	}
});

// @desc    Update a promo code
// @route   PUT /api/promos/:id
// @access  Private/Admin
const updatePromoCode = asyncHandler(async (req, res) => {
	const { code, discount, maxUses, expiresAt, users } = req.body;
	const promoCode = await PromoCode.findById(req.params.id);

	if (!promoCode) {
		res.status(404);
		throw new Error("Promo code not found");
	}

	promoCode.code = code || promoCode.code;
	promoCode.discount = discount || promoCode.discount;
	promoCode.maxUses = maxUses || promoCode.maxUses;
	promoCode.expiresAt = expiresAt || promoCode.expiresAt;
	promoCode.users = users || promoCode.users;

	const updatedPromoCode = await promoCode.save();

	res.status(200).json(updatedPromoCode);
});

// @desc    Delete a promo code
// @route   DELETE /api/promos/:id
// @access  Private/Admin
const deletePromoCode = asyncHandler(async (req, res) => {
	const promoCode = await PromoCode.findById(req.params.id);

	if (!promoCode) {
		res.status(404);
		throw new Error("Promo code not found");
	}

	await promoCode.deleteOne({ _id: req.params.id });

	res.status(200).json({ message: "Promo code removed" });
});

export {
	getPromoCodes,
	getPromoCode,
	usePromoCode,
	checkPromoCode,
	createPromoCode,
	updatePromoCode,
	deletePromoCode
};
