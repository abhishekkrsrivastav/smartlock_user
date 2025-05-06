import express from 'express';
import { deleteUser, getUsers, login, updateUser } from '../../controllers/smartLock/smartLockController.js';
import { addUser } from '../../controllers/smartLock/smartLockController.js';
import { requireSignIn } from '../../middleware/smartLock/requireSignIn.js';
const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login (Admin, Vendor, Customer)
 *     tags: [User]
 *     description: Authenticates a user and returns a JWT token if credentials are valid.
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
 *               password:
 *                 type: string
 *           examples:
 *             Admin:
 *               summary: Admin login
 *               value:
 *                 email: admin@gmail.com
 *                 password: admin123
 *             Vendor:
 *               summary: Vendor login
 *               value:
 *                 email: shru@gmail.com
 *                 password: shru123
 *             Customer:
 *               summary: Customer login
 *               value:
 *                 email: shruti@gmail.com
 *                 password: shru123
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
 *             examples:
 *               Admin:
 *                 summary: Admin Login Response
 *                 value:
 *                   success: true
 *                   message: Login successful
 *                   token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   user_data:
 *                     id: 1
 *                     fname: ajit
 *                     lname: singh
 *                     email: admin@gmail.com
 *                     phoneNumber: "7059290951"
 *                     userType: 1
 *                     created_at: "2025-05-05T06:11:30.000Z"
 *                     created_by: null
 *               Vendor:
 *                 summary: Vendor Login Response
 *                 value:
 *                   success: true
 *                   message: Login successful
 *                   token: eyJh...vendor
 *                   user_data:
 *                     id: 2
 *                     fname: shruti
 *                     lname: dulare
 *                     email: shru@gmail.com
 *                     phoneNumber: "9876543210"
 *                     userType: 2
 *                     created_at: "2025-05-05T08:00:00.000Z"
 *                     created_by: 1
 *               Customer:
 *                 summary: Customer Login Response
 *                 value:
 *                   success: true
 *                   message: Login successful
 *                   token: eyJh...customer
 *                   user_data:
 *                     id: 3
 *                     fname: shruti
 *                     lname: dulare
 *                     email: shruti@gmail.com
 *                     phoneNumber: "9090909090"
 *                     userType: 3
 *                     created_at: "2025-05-05T10:00:00.000Z"
 *                     created_by: 2
 *       400:
 *         description: Email or password missing
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









