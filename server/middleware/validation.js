import { body, validationResult } from "express-validator";

// Middleware to check validation results
export const checkValidation = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const errorMessages = errors.array().map((error) => error.msg);
		res.status(400);
		throw new Error(errorMessages.join(", "));
	}
	next();
};

// User validation rules
export const validateRegister = [
	body("name")
		.trim()
		.isLength({ min: 2, max: 50 })
		.withMessage("Name must be between 2 and 50 characters"),
	body("email")
		.isEmail()
		.normalizeEmail()
		.withMessage("Please provide a valid email"),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long")
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
		.withMessage(
			"Password must contain at least one uppercase letter, one lowercase letter, and one number"
		),
	checkValidation
];

export const validateLogin = [
	body("email")
		.isEmail()
		.normalizeEmail()
		.withMessage("Please provide a valid email"),
	body("password").notEmpty().withMessage("Password is required"),
	checkValidation
];

export const validateUpdateProfile = [
	body("name")
		.optional()
		.trim()
		.isLength({ min: 2, max: 50 })
		.withMessage("Name must be between 2 and 50 characters"),
	body("email")
		.optional()
		.isEmail()
		.normalizeEmail()
		.withMessage("Please provide a valid email"),
	body("password")
		.optional({ values: "falsy" })
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long")
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
		.withMessage(
			"Password must contain at least one uppercase letter, one lowercase letter, and one number"
		),
	checkValidation
];

export const validateAdminUserUpdate = [
	body("name")
		.optional()
		.trim()
		.isLength({ min: 2, max: 50 })
		.withMessage("Name must be between 2 and 50 characters"),
	body("email")
		.optional()
		.isEmail()
		.normalizeEmail()
		.withMessage("Please provide a valid email"),
	body("password")
		.optional({ values: "falsy" })
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long")
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
		.withMessage(
			"Password must contain at least one uppercase letter, one lowercase letter, and one number"
		),
	body("isAdmin")
		.optional()
		.isBoolean()
		.withMessage("isAdmin must be a boolean value"),
	checkValidation
];

// Product validation rules
export const validateProduct = [
	body("name")
		.trim()
		.isLength({ min: 1, max: 100 })
		.withMessage("Product name must be between 1 and 100 characters"),
	body("price")
		.optional()
		.isNumeric()
		.isFloat({ min: 0 })
		.withMessage("Price must be a positive number"),
	body("description")
		.optional()
		.trim()
		.isLength({ min: 1, max: 1000 })
		.withMessage("Description must be between 1 and 1000 characters"),
	body("brand")
		.optional()
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage("Brand must be between 1 and 50 characters"),
	body("category")
		.optional()
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage("Category must be between 1 and 50 characters"),
	body("countInStock")
		.optional()
		.isInt({ min: 0 })
		.withMessage("Count in stock must be a non-negative integer"),
	checkValidation
];

// Product creation validation rules (stricter)
export const validateProductCreate = [
	body("name")
		.trim()
		.isLength({ min: 1, max: 100 })
		.withMessage(
			"Product name is required and must be between 1 and 100 characters"
		),
	body("price")
		.isNumeric()
		.isFloat({ min: 0 })
		.withMessage("Price is required and must be a positive number"),
	body("description")
		.trim()
		.isLength({ min: 10, max: 1000 })
		.withMessage(
			"Description is required and must be between 10 and 1000 characters"
		),
	body("brand")
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage("Brand is required and must be between 1 and 50 characters"),
	body("category")
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage(
			"Category is required and must be between 1 and 50 characters"
		),
	body("countInStock")
		.isInt({ min: 0 })
		.withMessage("Count in stock must be a non-negative integer"),
	checkValidation
];

// Product update validation rules (more flexible)
export const validateProductUpdate = [
	body("name")
		.optional()
		.trim()
		.isLength({ min: 1, max: 100 })
		.withMessage("Product name must be between 1 and 100 characters"),
	body("price")
		.optional()
		.isNumeric()
		.isFloat({ min: 0 })
		.withMessage("Price must be a positive number"),
	body("description")
		.optional()
		.trim()
		.isLength({ min: 1, max: 1000 })
		.withMessage("Description must be between 1 and 1000 characters"),
	body("brand")
		.optional()
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage("Brand must be between 1 and 50 characters"),
	body("category")
		.optional()
		.trim()
		.isLength({ min: 1, max: 50 })
		.withMessage("Category must be between 1 and 50 characters"),
	body("countInStock")
		.optional()
		.isInt({ min: 0 })
		.withMessage("Count in stock must be a non-negative integer"),
	checkValidation
];

// Review validation rules
export const validateReview = [
	body("rating")
		.isInt({ min: 1, max: 5 })
		.withMessage("Rating must be between 1 and 5"),
	body("comment")
		.trim()
		.isLength({ min: 1, max: 500 })
		.withMessage("Comment is required and must be less than 500 characters"),
	checkValidation
];

// Order validation rules
export const validateOrder = [
	body("orderItems")
		.isArray({ min: 1 })
		.withMessage("Order must have at least one item"),
	body("shippingAddress.address")
		.trim()
		.notEmpty()
		.withMessage("Shipping address is required"),
	body("shippingAddress.city")
		.trim()
		.notEmpty()
		.withMessage("City is required"),
	body("shippingAddress.postalCode")
		.trim()
		.notEmpty()
		.withMessage("Postal code is required"),
	body("shippingAddress.country")
		.trim()
		.notEmpty()
		.withMessage("Country is required"),
	body("paymentMethod")
		.trim()
		.notEmpty()
		.withMessage("Payment method is required"),
	body("itemsPrice")
		.isFloat({ min: 0 })
		.withMessage("Items price must be a positive number"),
	body("taxPrice")
		.isFloat({ min: 0 })
		.withMessage("Tax price must be a positive number"),
	body("shippingPrice")
		.isFloat({ min: 0 })
		.withMessage("Shipping price must be a positive number"),
	body("totalPrice")
		.isFloat({ min: 0 })
		.withMessage("Total price must be a positive number"),
	checkValidation
];

// Promo code validation rules
export const validatePromoCode = [
	body("code")
		.trim()
		.isLength({ min: 3, max: 20 })
		.isAlphanumeric()
		.withMessage("Promo code must be 3-20 alphanumeric characters"),
	body("discount")
		.isFloat({ min: 0, max: 100 })
		.withMessage("Discount must be between 0 and 100"),
	body("maxUses").isInt({ min: 1 }).withMessage("Max uses must be at least 1"),
	body("expiresAt").isISO8601().withMessage("Expiry date must be a valid date"),
	checkValidation
];
