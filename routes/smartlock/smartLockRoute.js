import express from 'express';
import { deleteUser, getUsers, login, updateUser } from '../../controllers/smartLock/smartLockController.js';
import { addUser } from '../../controllers/smartLock/smartLockController.js';
import { requireSignIn } from '../../middleware/smartLock/requireSignIn.js';
const router = express.Router();

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: user@123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user_data:
 *                   type: object
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: No email registered
 *       500:
 *         description: Server error
 */


router.post("/login", login);
// router.post("/create", requireSignIn, addUser);
 
/**
 * @swagger
 * /api/user/add:
 *   post:
 *     summary: Add a new user (Admin & Vendor only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fname
 *               - lname
 *               - email
 *               - phoneNumber
 *               - password
 *               - userType
 *             properties:
 *               fname:
 *                 type: string
 *               lname:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *               userType:
 *                 type: integer
 *                 description: 1 = Admin, 2 = Vendor, 3 = Customer
 *     responses:
 *       201:
 *         description: User added successfully
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Role not allowed to add user
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */

router.post('/add', requireSignIn, addUser);
/**
 * @swagger
 * /api/user/get:
 *   get:
 *     summary: Get user(s) based on role
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Admin gets all users, Vendor gets own customers, Customer gets self.
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer }
 *                       fname: { type: string }
 *                       lname: { type: string }
 *                       email: { type: string }
 *                       phoneNumber: { type: string }
 *                       userType: { type: integer }
 *                       created_by: { type: integer }
 *       500:
 *         description: Server error
 */

router.get('/get', requireSignIn, getUsers);
/**
 * @swagger
 * /api/user/update/{id}:
 *   put:
 *     summary: Update user details (only self unless Admin)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fname: { type: string }
 *               lname: { type: string }
 *               email: { type: string }
 *               phoneNumber: { type: string }
 *               password: { type: string }
 *               userType: { type: integer }
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Not authorized to update this user
 *       500:
 *         description: Server error
 */

router.put('/update/:id', requireSignIn, updateUser);
/**
 * @swagger
 * /api/user/delete/{id}:
 *   delete:
 *     summary: Delete a user (Admins can delete anyone, Vendors their customers, Customers themselves)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Not authorized to delete this user
 *       500:
 *         description: Server error
 */

router.delete('/delete/:id', requireSignIn, deleteUser);



export default router;









