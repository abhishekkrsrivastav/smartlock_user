import express from 'express';
import { requireSignIn } from '../../middleware/smartLock/requireSignIn.js';
import {
  addDevice,
  getDevices,
  updateDevice,
  deleteDevice,
  logEntry,
  getEntry,
  activateDevice,
  registerDevice,
  getDeviceByPhone,
  getMyDevice
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


/**
 * @swagger
 * /entry:
 *   post:
 *     summary: Log in-time or out-time for a user entry
 *     tags: [Entry Log]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Logs the in-time or out-time of a user based on `access_type`.  
 *       - If `access_type` = `"in"` → inserts a new entry.  
 *       - If `access_type` = `"out"` → updates the latest unmatched "in" entry.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - device_id
 *               - access_type
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 7
 *               device_id:
 *                 type: integer
 *                 example: 3
 *               access_type:
 *                 type: string
 *                 enum: [in, out]
 *                 example: "in"
 *               age_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 2
 *               gender_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: In-time successfully logged
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "In-time logged"
 *       200:
 *         description: Out-time successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Out-time updated"
 *       400:
 *         description: Invalid access_type
 *       404:
 *         description: No matching in-time found for out
 *       500:
 *         description: Server error
 */



router.post("/entry", requireSignIn, logEntry);

/**
 * @swagger
 * /get-entry:
 *   get:
 *     summary: Get entry logs based on user role
 *     tags: [Entry Log]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       - **Admin**: can view all logs.  
 *       - **Vendor**: can view logs of customers they created.  
 *       - **Customer**: can view only their own logs.
 *     responses:
 *       200:
 *         description: List of entry logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 5
 *                       user_id:
 *                         type: integer
 *                         example: 7
 *                       device_id:
 *                         type: integer
 *                         example: 3
 *                       in_time:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-12T08:30:00.000Z"
 *                       out_time:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: "2025-05-12T09:00:00.000Z"
 *                       age_id:
 *                         type: integer
 *                         nullable: true
 *                         example: 2
 *                       gender_id:
 *                         type: integer
 *                         nullable: true
 *                         example: 1
 *       404:
 *         description: No entry logs found
 *       500:
 *         description: Server error
 */

router.get('/get-entry', requireSignIn, getEntry);



router.post('/register-device', requireSignIn, registerDevice);
router.put('/activate-device', requireSignIn, activateDevice);


router.get('/my-device', requireSignIn, getMyDevice);
router.get("/device/by-phone/:phone",  getDeviceByPhone);









export default router;

