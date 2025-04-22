import db from "../config/db.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const [existingUser] = await db.query(`select * from user_data where email=?`, [email]);

        if (existingUser.length === 0) {
            return res.status(404).json({ message: "No email registered" });
        }

        


        // password matching
        const verifyPassword = await bcrypt.compare(password, existingUser[0].password);
        if (!verifyPassword) {
            return res.status(401).send({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: existingUser[0].id, userType: existingUser[0].userType },
            process.env.JWT_SECRET,
            { expiresIn: '9h' }
        );

        res.status(200).send({
            success: true,
            message: 'Login successful',
            token,
            existingUser: {
                id: existingUser[0].id,
                email: existingUser[0].email,
                userType: existingUser[0].userType,
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
}