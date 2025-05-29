 
import express from 'express';
import { requireSignIn } from '../../middleware/smartLock/requireSignIn.js';
import { createSubscriptionPlan, deleteSubscriptionPlan, getAllSubscriptionPlans, updateSubscriptionPlan } from '../../controllers/subscription Plan/subPlanController.js';
 
const router = express.Router();

/**
 * @swagger
 * /add-subscription:
 *   post:
 *     summary: Create a new subscription plan (Admin/Vendor only)
 *     tags: [Subscription Plan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan_name
 *               - token_limit
 *               - price
 *               - validity_days
 *             properties:
 *               plan_name:
 *                 type: string
 *                 example: "Pro Plan"
 *               token_limit:
 *                 type: integer
 *                 example: 5000
 *               price:
 *                 type: number
 *                 format: integer
 *                 example: 999
 *               validity_days:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: New subscription plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: New Subscription Plan added successfully
 *                 id:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: All fields are required
 *       403:
 *         description: Customers are not allowed to create plans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Customers are not allowed to create plans
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 *                 details:
 *                   type: string
 *                   example: Some internal error message
 */

 

// Create a new subscription plan (Admin)
router.post('/add-subscription', requireSignIn, createSubscriptionPlan);

 /**
 * @swagger
 * /get-subscription:
 *   get:
 *     summary: Get all subscription plans
 *     tags: [Subscription Plan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all available subscription plans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 plans:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 5
 *                       plan_name:
 *                         type: string
 *                         example: "XRDA3 Plan"
 *                       token_limit:
 *                         type: integer
 *                         example: 1500
 *                       price:
 *                         type: number
 *                         format: integer
 *                         example: 299 
 *                       validity_days:
 *                         type: integer
 *                         example: 90
 *                       created_by:
 *                         type: integer
 *                         example: 1
 *       401:
 *         description: Unauthorized - Token required
 *       500:
 *         description: Server error
 */



// Get all subscription plans
router.get('/get-subscription', requireSignIn, getAllSubscriptionPlans);

// // Get a specific subscription plan by ID
// router.get('/:id', requireSignIn, getSubscriptionPlanById);


 /**
 * @swagger
 * /update-subscription/{id}:
 *   put:
 *     summary: Update an existing subscription plan
 *     tags: [Subscription Plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the subscription plan to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan_name
 *               - token_limit
 *               - price
 *               - validity_days
 *             properties:
 *               plan_name:
 *                 type: string
 *                 example: "Updated Premium Plan"
 *               token_limit:
 *                 type: integer
 *                 example: 2000
 *               price:
 *                 type: number
 *                 format: integer
 *                 example: 399
 *               validity_days:
 *                 type: integer
 *                 example: 120
 *     responses:
 *       200:
 *         description: Subscription plan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Subscription Plan updated successfully
 *       403:
 *         description: Only admin can update subscription plans
 *       404:
 *         description: Subscription Plan not found
 *       500:
 *         description: Server error
 */



// // Update a subscription plan
router.put('/update-subscription/:id', requireSignIn, updateSubscriptionPlan);

/**
 * @swagger
 * /delete-subscription/{id}:
 *   delete:
 *     summary: Delete a subscription plan (Admin only)
 *     tags: [Subscription Plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the subscription plan to delete
 *     responses:
 *       200:
 *         description: Subscription Plan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Subscription Plan deleted successfully
 *       403:
 *         description: Forbidden - Only admin can delete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Only admin can delete subscription plans
 *       404:
 *         description: Subscription Plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription Plan not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 *                 error:
 *                   type: string
 *                   example: Some DB error message
 */


// // Delete a subscription plan
router.delete('/delete-subscription/:id', requireSignIn, deleteSubscriptionPlan);

export default router;

