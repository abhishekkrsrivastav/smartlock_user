import express from 'express';
import { requireSignIn } from '../../middleware/smartLock/requireSignIn.js';
import { assignSubscription, deleteSubscription, getAllSubscriptions, } from '../../controllers/subscription/subscriptionController.js';

const router = express.Router();


/**
 * @swagger
 * /assign-subscription:
 *   post:
 *     summary: Assign / Renew / Upgrade a subscription plan to a user with devices
 *     tags: [Assign Subscription]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Allows assigning a subscription plan to a user along with one or more devices.
 *       
 *       🔐 **Role-based access rules:**
 *       
 *       - **Admin** (userType = 1): Can assign to any user.
 *       - **Vendor** (userType = 2): Can assign to customers created by themselves.
 *       - **Customer** (userType = 3): Can assign only to themselves.
 *       
 *       ❌ If role restrictions are violated, a 403 Forbidden error is returned.
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
 *                 example: 3
 *               device_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example:
 *                   - 1
 *                   - 2
 *                   - 3
 *               plan_id:
 *                 type: integer
 *                 example: 1
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-20"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-20"
 *     responses:
 *       201:
 *         description: Subscription successfully assigned
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
 *                   example: Subscription assigned
 *                 id:
 *                   type: integer
 *                   example: 1
 *       403:
 *         description: Forbidden access due to role restrictions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customers can only assign subscriptions to themselves
 *       404:
 *         description: Plan not found or invalid user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan not found
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
 *                   example: Some internal DB error message
 */





// Assign a subscription for a customer (Admin and vendor and customer)
router.post("/assign-subscription", requireSignIn, assignSubscription)

/**
* @swagger
* /get-subscriptions:
*   get:
*     summary: Get subscriptions for admin, vendor, or customer
*     tags: [Assign Subscription]
*     security:
*       - bearerAuth: []
*     description: >
*       Fetches subscriptions based on the role of the authenticated user.
*       
*       🔐 **Role-based behavior:**
*       
*       - **Admin** (userType = 1): Gets all subscriptions in the system.
*       - **Vendor** (userType = 2): Gets subscriptions created by this vendor.
*       - **Customer** (userType = 3): Gets only their own subscriptions.
*       
*       Each subscription also includes an array of associated `device_ids`.
*     responses:
*       200:
*         description: List of subscriptions
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
*                         example: 1
*                       user_id:
*                         type: integer
*                         example: 3
*                       plan_id:
*                         type: integer
*                         example: 1
*                       remaining_tokens:
*                         type: integer
*                         example: 1000
*                       start_date:
*                         type: string
*                         format: date
*                         example: "2025-05-20"
*                       end_date:
*                         type: string
*                         format: date
*                         example: "2025-06-20"
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
*                         example: [1, 2, 3]
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
*                   example: Database connection failed
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

