 
import express from 'express';
import { requireSignIn } from '../../middleware/smartLock/requireSignIn.js';
import { createSubscriptionPlan } from '../../controllers/subscription Plan/subPlanController.js';
 
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


// Get all subscription plans
// router.get('/', requireSignIn, getAllSubscriptionPlans);

// // Get a specific subscription plan by ID
// router.get('/:id', requireSignIn, getSubscriptionPlanById);

// // Update a subscription plan
// router.put('/:id', requireSignIn, updateSubscriptionPlan);

// // Delete a subscription plan
// router.delete('/:id', requireSignIn, deleteSubscriptionPlan);

export default router;

