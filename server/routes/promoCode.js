import express from "express";
const router = express.Router();

import {
	getPromoCodes,
	getPromoCode,
	createPromoCode,
	usePromoCode,
	checkPromoCode,
	updatePromoCode,
	deletePromoCode
} from "../controllers/promoCode.js";
import { protect, admin } from "../middleware/auth.js";

router
	.route("/")
	.get(protect, admin, getPromoCodes)
	.post(protect, admin, createPromoCode);
router.route("/use").post(protect, usePromoCode);
router.route("/check").post(protect, checkPromoCode);
router
	.route("/:id")
	.get(protect, admin, getPromoCode)
	.put(protect, admin, updatePromoCode)
	.delete(protect, admin, deletePromoCode);

export default router;
