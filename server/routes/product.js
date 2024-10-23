import express from "express";
const router = express.Router();

import {
	getProductById,
	getProducts,
	createProduct,
	updateProduct,
	deleteProduct
} from "../controllers/product.js";
import { protect, admin } from "../middleware/auth.js";

router.route("/").get(getProducts).post(protect, admin, createProduct);
router
	.route("/:id")
	.get(getProductById)
	.put(protect, admin, updateProduct)
	.delete(protect, admin, deleteProduct);

export default router;
