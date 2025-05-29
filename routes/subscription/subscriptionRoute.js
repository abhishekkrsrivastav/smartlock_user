import express from 'express';
import { requireSignIn } from '../../middleware/smartLock/requireSignIn.js';
import { assignSubscription, deleteSubscription, getAllSubscriptions, } from '../../controllers/subscription/subscriptionController.js';

const router = express.Router();


/**
 * @swagger
 * /assign-subscription:
 *   post:
 *     summary: Assign, Renew or Upgrade a Subscription (Admin/Vendor/Customer)
 *     tags: [Assign Subscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan_id
 *               - device_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: Optional for Admin/Vendor. For customer, it's auto-taken from token.
 *                 example: 3
 *               plan_id:
 *                 type: integer
 *                 description: Subscription plan to assign
 *                 example: 5
 *               device_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [7, 8]
 *     responses:
 *       201:
 *         description: Subscription assigned successfully (new/renewed/upgraded)
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
 *                   example: Subscription assigned successfully
 *                 id:
 *                   type: integer
 *                   example: 2
 *                 start_date:
 *                   type: string
 *                   example: "2025-05-29 17:58:06"
 *                 end_date:
 *                   type: string
 *                   example: "2025-06-28 17:58:06"
 *       403:
 *         description: Forbidden (customer assigning to others, or vendor assigning to non-owned user)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customers can only assign subscriptions to themselves
 *       404:
 *         description: Plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan not found
 *       500:
 *         description: Internal server error
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
 *                   example: Detailed error message
 */




// Assign a subscription for a customer (Admin and vendor and customer)
router.post("/assign-subscription", requireSignIn, assignSubscription)

 /**
 * @swagger
 * /get-subscriptions:
 *   get:
 *     summary: Get all subscriptions ( Admin, Vendor, Customer)
 *     tags: [Assign Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscriptions based on user role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 subscriptions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 12
 *                       user_id:
 *                         type: integer
 *                         example: 3
 *                       plan_id:
 *                         type: integer
 *                         example: 5
 *                       remaining_tokens:
 *                         type: integer
 *                         example: 450
 *                       start_date:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-29T12:28:06.000Z"
 *                       end_date:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-28T12:28:06.000Z"
 *                       created_by:
 *                         type: integer
 *                         example: 3
 *                       status_id:
 *                         type: integer
 *                         example: 3
 *                       device_ids:
 *                         type: array
 *                         items:
 *                           type: integer
 *                         example: [1, 2]
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       500:
 *         description: Server error
 */



// Get details of subscriptions (Admin , Vendor for own customers)
router.get("/get-subscriptions", requireSignIn, getAllSubscriptions);

/**
 * @swagger
 * /delete-subscription:
 *   put:
 *     summary: Customer can Delete a subscription by marking its status_id as 5(Deleted)
 *     tags: [Assign Subscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscription_id
 *             properties:
 *               subscription_id:
 *                 type: integer
 *                 example: 12
 *     responses:
 *       200:
 *         description: Subscription deleted successfully
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
 *                   example: Subscription deleted successfully
 *       404:
 *         description: Subscription not found or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription not found or unauthorized
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
 *                   example: Some internal error
 */



// delete subscription by customer 
router.put("/delete-subscription", requireSignIn, deleteSubscription);
export default router;

