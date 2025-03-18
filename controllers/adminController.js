import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

// login for admin

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Please provide email and password',
            });
        }
        // Check if all fields are provided
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Please provide all fields',
            });
        }

        // Check if user exists with the given email 
        const [user] = await db.query(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );

        if (user.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'Admin not found',
            });
        }

        //  Check if user is trying to login as Admin
        if (user[0].userType === '1') {
            return res.status(403).send({
                success: false,
                message: 'Unauthorized Admin login attempt'
            });
        }

        // Check if password matches using bcrypt
        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(401).send({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user[0].id, userType: user[0].userType },
            process.env.JWT_SECRET,
            { expiresIn: '9h' }
        );

        res.status(200).send({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user[0].id,
                email: user[0].email,
                userType: user[0].userType,
            }
        });


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login user API',
            error
        });
    }
};



//  Add Vendor (vendor or Customer)
export const addVendor = async (req, res) => {

    try {
        const { fname, lname, email, phoneNumber, password, userType } = req.body;
        if (!fname || !lname || !email || !phoneNumber || !password || !userType) {
            return res.status(404).send({
                success: false,
                message: 'Please Provide all fields',
            })
        }

        //  Check if user is trying to register as Admin
        if (userType === '1') {
            return res.status(403).send({
                success: false,
                message: 'Only predefined admin email can register as Admin'
            });
        }

        // Check if email already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).send({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user into database
        const data = await db.query(`INSERT INTO users (fname,lname,email,phoneNumber,password,userType) VALUES (?,?,?,?,?,?)`, [fname, lname, email, phoneNumber, hashedPassword, userType])
        if (!data) {
            return res.status(404).send({
                success: false,
                message: 'Error in Insert query',
            })
        }
        res.status(201).send({
            success: true,
            message: "New vendor created successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in create vendor api',
            error
        })
    }
};

//  Get All Users
export const getVendor = async (req, res) => {
    try {
        const [users] = await db.query("SELECT user_id, fname, lname, email, userType FROM users");

        res.status(200).send({
            success: true,
            message: 'All Vendors Records',
            totalUsers: users.length,
            list: users,

        })
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching vendors", error });
    }
};



// DELETE USER
export const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM users WHERE user_id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Vendors not found" });
        }

        res.json({ success: true, message: "Vendors deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting vendors", error });
    }
};



// UPDATE USER
export const UpdateVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { fname, lname, email, userType } = req.body;

        const [result] = await db.query(
            "UPDATE users SET fname = ?, lname = ?, email = ?, userType = ? WHERE user_id = ?",
            [fname, lname, email, userType, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Vendor not found" });
        }

        res.json({ success: true, message: "Vendor updated successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating vendor", error });
    }
};
