 
import express from 'express';
import { requireSignIn } from '../../middleware/smartLock/requireSignIn.js';
import { createSubscriptionPlan, deleteSubscriptionPlan, getAllSubscriptionPlans, updateSubscriptionPlan } from '../../controllers/subscription Plan/subPlanController.js';
 
const router = express.Router();

 /**
 * @swagger
 * /add-subscription:
 *   post:
 *     summary: Create a new subscription plan (Admin, Vendor only)
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
 *             properties:
 *               plan_name:
 *                 type: string
 *                 example: Basic Plan
 *               token_limit:
 *                 type: integer
 *                 example: 1000
 *               price:
 *                 type: number
 *                 format: integer
 *                 example: 500
 *     description: >
 *       **Role-based access:**  
 *       - **Admin:** Can create any plan.  
 *       - **Vendor:** Can create plans for their own customers.  
 *       - **Customer:** ❌ Cannot create plans.
 *     responses:
 *       201:
 *         description: New Subscription Plan added successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
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
 *     description: >
 *       Returns a list of all available subscription plans. 
 *       
 *       🔐 Only accessible to authenticated users.
 *     responses:
 *       200:
 *         description: List of subscription plans
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
 *                         example: 1
 *                       plan_name:
 *                         type: string
 *                         example: Basic Plan
 *                       token_limit:
 *                         type: integer
 *                         example: 1000
 *                       price:
 *                         type: string
 *                         example: "500.00"
 *                       created_by:
 *                         type: integer
 *                         example: 1
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-08T07:10:55.000Z"
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
 *                   example: Something went wrong while fetching subscription plans
 */



// Get all subscription plans
router.get('/get-subscription', requireSignIn, getAllSubscriptionPlans);

// // Get a specific subscription plan by ID
// router.get('/:id', requireSignIn, getSubscriptionPlanById);


/**
 * @swagger
 * /update-subscription/{id}:
 *   put:
 *     summary: Update a subscription plan (Admin only)
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
 *             properties:
 *               plan_name:
 *                 type: string
 *                 example: Basic Plan
 *               token_limit:
 *                 type: integer
 *                 example: 1000
 *               price:
 *                 type: string
 *                 example: "400"
 *     responses:
 *       200:
 *         description: Subscription Plan updated successfully
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
 *         description: Forbidden - Only admin can update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Only admin can update subscription plans
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

