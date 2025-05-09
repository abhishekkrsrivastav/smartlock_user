import express from 'express';
import { requireSignIn } from '../../middleware/smartLock/requireSignIn.js';
import { assignSubscription, deleteSubscription, getAllSubscriptions, updateSubscription } from '../../controllers/subscription/subscriptionController.js';

const router = express.Router();




/**
 * @swagger
 * /assign-subscription:
 *   post:
 *     summary: Assign subscription to a customer (Admin, Vendor only for their customers)
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
 *               - user_id
 *               - device_id
 *               - plan_id
 *               - start_date
 *               - end_date
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user to assign the subscription
 *                 example: 3
 *               device_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of device IDs to be assigned with the subscription
 *                 example: [1, 2, 3]
 *               plan_id:
 *                 type: integer
 *                 description: ID of the subscription plan to assign
 *                 example: 2
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Start date of the subscription
 *                 example: "2025-05-01"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: End date of the subscription
 *                 example: "2026-05-01"
 *     description: >
 *       **Role-based access:**  
 *       - **Admin:** Can assign any subscription to any user.  
 *       - **Vendor:** Can assign subscription only to their own customers.  
 *       - **Customer:** ❌ Not allowed to assign subscriptions.
 *     responses:
 *       201:
 *         description: Subscription assigned successfully
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Not authorized to assign subscription
 *       404:
 *         description: Plan not found or customer not found
 *       500:
 *         description: Internal server error
 */



// Assign a subscription for a customer (Admin and vendor)
router.post("/assign-subscription", requireSignIn, assignSubscription)

/**
 * @swagger
 * /get-subscriptions:
 *   get:
 *     summary: Get all subscriptions (Admin, Vendor for their customers, Customer for their own subscriptions)
 *     tags: [Assign Subscription]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       **Role-based access:**  
 *       - **Admin:** Can get all subscriptions.  
 *       - **Vendor:** Can get subscriptions created by them (for their customers).  
 *       - **Customer:** Can get their own subscriptions.
 *     responses:
 *       200:
 *         description: Successfully fetched subscriptions
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
 *                         description: Subscription ID
 *                         example: 1
 *                       user_id:
 *                         type: integer
 *                         description: The user ID to whom the subscription is assigned
 *                         example: 3
 *                       plan_id:
 *                         type: integer
 *                         description: The subscription plan ID
 *                         example: 2
 *                       start_date:
 *                         type: string
 *                         format: date
 *                         description: Start date of the subscription
 *                         example: "2025-05-01"
 *                       end_date:
 *                         type: string
 *                         format: date
 *                         description: End date of the subscription
 *                         example: "2026-05-01"
 *                       device_ids:
 *                         type: array
 *                         items:
 *                           type: integer
 *                         description: List of device IDs associated with the subscription
 *                         example: [1, 2, 3]
 *       500:
 *         description: Server error
 *       401:
 *         description: Unauthorized access (missing or invalid token)
 */



// Get details of subscriptions (Admin , Vendor for own customers)
router.get("/get-subscriptions", requireSignIn, getAllSubscriptions);


// get details by id
// router.get("/get-subscriptions/:Id", requireSignIn, getSubscriptionDetails);

/**
 * @swagger
 * /update-subscriptions/{id}:
 *   put:
 *     summary: Update subscription details (Admin, Vendor for own customers)
 *     tags: [Assign Subscription]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       **Role-based access:**  
 *       - **Admin:** Can update any subscription.  
 *       - **Vendor:** Can update subscriptions for their own customers only.  
 *       - **Customer:** Cannot update subscriptions.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The subscription ID to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: The user ID to whom the subscription is assigned
 *                 example: 3
 *               device_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of device IDs associated with the subscription
 *                 example: [1, 2, 3]
 *               plan_id:
 *                 type: integer
 *                 description: The subscription plan ID
 *                 example: 2
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Start date of the subscription
 *                 example: "2025-05-01"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: End date of the subscription
 *                 example: "2026-05-01"
 *     responses:
 *       200:
 *         description: Successfully updated subscription
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
 *                   example: "Subscription updated successfully"
 *       400:
 *         description: Missing or invalid required fields
 *       403:
 *         description: Unauthorized access for customers or invalid vendor operation
 *       404:
 *         description: Subscription or plan not found
 *       500:
 *         description: Server error
 */



// Update subscription details (Admin, Vendor for own customers)
router.put('/update-subscriptions/:id', requireSignIn, updateSubscription);

/**
 * @swagger
 * /delete-subscriptions/{id}:
 *   delete:
 *     summary: Delete subscription (Admin, Vendor for own customers)
 *     tags: [Assign Subscription]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       **Role-based access:**  
 *       - **Admin:** Can delete any subscription.  
 *       - **Vendor:** Can delete subscriptions for their own customers only.  
 *       - **Customer:** Cannot delete subscriptions.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The subscription ID to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully deleted the subscription
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
 *                   example: "Subscription deleted successfully"
 *       403:
 *         description: Unauthorized access for customers or invalid vendor operation
 *       404:
 *         description: Subscription not found
 *       500:
 *         description: Server error
 */



// Delete a subscription (Admin, Vendor for own customers)
router.delete('/delete-subscriptions/:id', requireSignIn, deleteSubscription);

export default router;

