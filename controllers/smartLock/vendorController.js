import db from '../../config/db.js';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

export const create = async (req, res) => {
    try {
        const {   email, phoneNumber, password, userType } = req.body;
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

 