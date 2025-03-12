import db from "../config/db.js";
import bcrypt from "bcrypt";

//  Add User (Manager or Customer)
export const addUser = async (req, res) => {
    try {
        const { fname, lname, email, password, userType } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        await db.query(
            "INSERT INTO users (fname, lname, email, password, userType) VALUES (?, ?, ?, ?, ?)",
            [fname, lname, email, hashedPassword, userType]
        );

        res.status(201).json({ success: true, message: "User added successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding user", error });
    }
};

//  Get All Users
export const getUsers = async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, fname, lname, email, userType FROM users");
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users", error });
    }
};

//  Delete User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM users WHERE id = ?", [id]);
        res.json({ success: true, message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting user", error });
    }
};
