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
 * /add:
 *   post:
 *     summary: Add a new user (Admin, Vendor)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       **Role-based access:**  
 *       - **Admin:** Can add Admin, Vendor, and Customer.  
 *       - **Vendor:** Can add only Customers.  
 *       - **Customer:** Cannot add any users.
 *       
 *       > 🔐 Only Admin and Vendor are allowed to access this endpoint.
 *       
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
 *           examples:
 *             AdminCreatesVendor:
 *               summary: Admin creates vendor
 *               value:
 *                 fname: shruti
 *                 lname: dulare
 *                 email: shru@gmail.com
 *                 phoneNumber: "7059290951"
 *                 password: shru123
 *                 userType: 2
 *             VendorCreatesCustomer:
 *               summary: Vendor creates customer
 *               value:
 *                 fname: abhishek
 *                 lname: srivastav
 *                 email: abhi@gmail.com
 *                 phoneNumber: "7059290951"
 *                 password: abhi123
 *                 userType: 3
 *     responses:
 *       201:
 *         description: User added successfully
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Unauthorized to add this type of user
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */



router.post('/add', requireSignIn, addUser);
 
/**
 * @swagger
 * /get:
 *   get:
 *     summary: Get users list (role-based access)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       **Role-based access:**  
 *       - **Admin:** Can view all users.  
 *       - **Vendor:** Can view only the customers they have created.  
 *       - **Customer:** Can view only their own data.
 *       
 *       > 🔍 This endpoint returns user details based on the requesting user's role.
 *       
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       fname:
 *                         type: string
 *                         example: John
 *                       lname:
 *                         type: string
 *                         example: Doe
 *                       email:
 *                         type: string
 *                         example: john.doe@example.com
 *                       phoneNumber:
 *                         type: string
 *                         example: "1234567890"
 *                       userType:
 *                         type: integer
 *                         example: 2
 *                       created_by:
 *                         type: integer
 *                         example: 1
 *       500:
 *         description: Internal server error
 */




router.get('/get', requireSignIn, getUsers);
 
/**
 * @swagger
 * /update/{id}:
 *   put:
 *     summary: Update user profile (self-edit only for Vendor/Customer)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to be updated
 *     description: |
 *       **Role-based access:**  
 *       - **Admin:** Can only update their own profile.  
 *       - **Vendor:** Can only update their own profile.  
 *       - **Customer:** Can only update their own profile.
 *       
 *       > ⚠️ Users cannot update other users' information.
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
 *           example:
 *             fname: Ajay
 *             lname: Mehta
 *             email: ajay@gmail.com
 *             phoneNumber: "9876543210"
 *             password: newpassword123
 *             userType: 3
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Unauthorized to edit this profile
 *       500:
 *         description: Internal server error
 */



router.put('/update/:id', requireSignIn, updateUser);
 
/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Delete a user (based on role)
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
 *     description: |
 *       **Role-based access:**  
 *       - **Admin:** Can delete any user.  
 *       - **Vendor:** Can delete only customers created by them.  
 *       - **Customer:** Can delete only their own account.
 *       
 *       > ⚠️ Users cannot delete other users unless permitted by their role.
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Not authorized to delete this user
 *       500:
 *         description: Internal server error
 */




router.delete('/delete/:id', requireSignIn, deleteUser);



export default router;









