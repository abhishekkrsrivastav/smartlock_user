import db from '../../config/db.js';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

export const create = async (req, res) => {
    try {
        const { fname, lname, email, phoneNumber, password, userType } = req.body;
        if (!fname || !lname || !email || !phoneNumber || !password || !userType) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields"
            });
        }

        const [existingUser] = await db.query(`select * from user_data where email=?`, [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered try another one"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const [data] = await db.query(`insert into user_data (fname, lname, email, phoneNumber, password, userType) values (?,?,?,?,?,?)`,
            [fname, lname, email, phoneNumber, hashedPassword, userType]);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "No data found"
            })
        }

        res.status(201).json({
            success: true,
            message: "new user added successfully",

        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error
        })


    }
}

 
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
        const user_data = existingUser[0];
        delete user_data.password;
        res.status(200).send({
            success: true,
            message: 'Login successful',
            token,
            // existingUser: {
            //     id: existingUser[0].id,
            //     email: existingUser[0].email,
            //     userType: existingUser[0].userType,
            // }
            user_data
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