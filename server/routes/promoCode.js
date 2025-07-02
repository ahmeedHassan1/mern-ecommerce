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

/**
 * @swagger
 * /api/promos:
 *   get:
 *     summary: Get all promo codes (Admin only)
 *     tags: [Promo Codes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all promo codes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PromoCode'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Admin access required
 *   post:
 *     summary: Create a new promo code (Admin only)
 *     tags: [Promo Codes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discountType
 *               - discountValue
 *               - expiresAt
 *               - maxUses
 *             properties:
 *               code:
 *                 type: string
 *                 example: SAVE20
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 example: percentage
 *               discountValue:
 *                 type: number
 *                 example: 20
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-12-31T23:59:59.000Z
 *               maxUses:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       201:
 *         description: Promo code created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromoCode'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Admin access required
 */
router
	.route("/")
	.get(protect, admin, getPromoCodes)
	.post(protect, admin, createPromoCode);

/**
 * @swagger
 * /api/promos/check:
 *   post:
 *     summary: Check if a promo code is valid
 *     tags: [Promo Codes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: SAVE20
 *     responses:
 *       200:
 *         description: Promo code is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 promoCode:
 *                   $ref: '#/components/schemas/PromoCode'
 *       400:
 *         description: Promo code is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Promo code expired
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.route("/check").post(protect, checkPromoCode);

/**
 * @swagger
 * /api/promos/use:
 *   post:
 *     summary: Use a promo code
 *     tags: [Promo Codes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: SAVE20
 *     responses:
 *       200:
 *         description: Promo code applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Promo code applied successfully
 *                 promoCode:
 *                   $ref: '#/components/schemas/PromoCode'
 *       400:
 *         description: Cannot use promo code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Promo code already used or expired
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.route("/use").post(protect, usePromoCode);

/**
 * @swagger
 * /api/promos/{id}:
 *   get:
 *     summary: Get promo code by ID (Admin only)
 *     tags: [Promo Codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promo code ID
 *     responses:
 *       200:
 *         description: Promo code data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromoCode'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Promo code not found
 *   put:
 *     summary: Update promo code by ID (Admin only)
 *     tags: [Promo Codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promo code ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PromoCode'
 *     responses:
 *       200:
 *         description: Promo code updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromoCode'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Promo code not found
 *   delete:
 *     summary: Delete promo code by ID (Admin only)
 *     tags: [Promo Codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promo code ID
 *     responses:
 *       200:
 *         description: Promo code deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Promo code removed
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Promo code not found
 */
router
	.route("/:id")
	.get(protect, admin, getPromoCode)
	.put(protect, admin, updatePromoCode)
	.delete(protect, admin, deletePromoCode);

export default router;
