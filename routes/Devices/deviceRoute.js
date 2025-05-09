import express from 'express';
import { requireSignIn } from '../../middleware/smartLock/requireSignIn.js';
import {
  addDevice,
  getDevices,
  updateDevice,
  deleteDevice
} from '../../controllers/devices/deviceController.js';

const router = express.Router();

// All routes require user to be signed in

/**
 * @swagger
 * /add-device:
 *   post:
 *     summary: Add a new device (Admin, Vendor only)
 *     tags: [Device]
 *     security:
 *       - Bearer Token: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceCode
 *               - deviceName
 *               - assigned_user_id
 *             properties:
 *               deviceCode:
 *                 type: string
 *                 example: DEV123
 *               deviceName:
 *                 type: string
 *                 example: Smart Lock Pro
 *               assigned_user_id:
 *                 type: int
 *                 example: 1
 *     description: >
 *       **Role-based access:**  
 *       - **Admin:** Can assign device to any user.  
 *       - **Vendor:** Can assign device only to their own customers.  
 *       - **Customer:** ❌ Not allowed to add devices.
 *     responses:
 *       201:
 *         description: Device added successfully
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Not authorized to add device
 *       404:
 *         description: Assigned user not found
 *       409:
 *         description: Device code already exists
 *       500:
 *         description: Internal server error
 */

router.post('/add-device', requireSignIn, addDevice);

/**
 * @swagger
 * /get-device:
 *   get:
 *     summary: Get list of devices (based on role)
 *     tags: [Device]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       **Role-based access:**  
 *       - **Admin:** Can view all devices.  
 *       - **Vendor:** Can view only devices created by them.  
 *       - **Customer:** Can view only devices assigned to them.
 *     responses:
 *       200:
 *         description: Devices fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 devices:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       deviceCode:
 *                         type: string
 *                         example: DEV123
 *                       deviceName:
 *                         type: string
 *                         example: Smart Lock Pro
 *                       assigned_user_id:
 *                         type: integer
 *                         example: 1
 *                       created_by:
 *                         type: integer
 *                         example: 2
 *       500:
 *         description: Internal server error
 */

router.get('/get-device', requireSignIn, getDevices);

/**
 * @swagger
 * /update-device/{id}:
 *   put:
 *     summary: Update a device (based on role)
 *     tags: [Device]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Device ID to update
 *     description: >
 *       **Role-based access:**  
 *       - **Admin:** Can update any device.  
 *       - **Vendor:** Can update only devices created by them.  
 *       - **Customer:** Can update only devices assigned to them.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceName
 *               - assigned_user_id
 *             example:
 *               deviceName: Updated Lock
 *               assigned_user_id: 1
 *     responses:
 *       200:
 *         description: Device updated successfully
 *       400:
 *         description: Missing fields
 *       403:
 *         description: Unauthorized to update this device
 *       404:
 *         description: Device not found
 *       500:
 *         description: Internal server error
 */

router.put('/update-device/:id', requireSignIn, updateDevice);

/**
 * @swagger
 * /delete-device/{id}:
 *   delete:
 *     summary: Delete a device (based on role)
 *     tags: [Device]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Device ID to delete
 *     description: >
 *       **Role-based access:**  
 *       - **Admin:** Can delete any device.  
 *       - **Vendor:** Can delete only devices created by them.  
 *       - **Customer:** Can delete only devices assigned to them.
 *     responses:
 *       200:
 *         description: Device deleted successfully
 *       403:
 *         description: Not authorized to delete this device
 *       404:
 *         description: Device not found
 *       500:
 *         description: Internal server error
 */

router.delete('/delete-device/:id', requireSignIn, deleteDevice);

export default router;

