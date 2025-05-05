import db from '../../config/db.js';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

// export const create = async (req, res) => {
//     try {
//         const { fname, lname, email, phoneNumber, password, userType } = req.body;
//         if (!fname || !lname || !email || !phoneNumber || !password || !userType) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please provide all fields"
//             });
//         }

//         const [existingUser] = await db.query(`select * from user_data where email=?`, [email]);
//         if (existingUser.length > 0) {
//             return res.status(409).json({
//                 success: false,
//                 message: "Email already registered try another one"
//             });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt)

//         const [data] = await db.query(`insert into user_data (fname, lname, email, phoneNumber, password, userType) values (?,?,?,?,?,?)`,
//             [fname, lname, email, phoneNumber, hashedPassword, userType]);

//         if (!data) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No data found"
//             })
//         }

//         res.status(201).json({
//             success: true,
//             message: "new user added successfully",

//         })

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             error
//         })


//     }
// }


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






// export const addUser = async (req, res) => {
//     try {
//       const { fname, lname, email, phoneNumber, password, userType } = req.body;

//       if (!fname || !lname || !email || !phoneNumber || !password || !userType) {
//         return res.status(400).json({ message: "All fields are required" });
//       }

//       // Role-based access check
//       if (req.user.userType === 2 && userType === 3) { // Vendor can only add customer
//         return res.status(403).json({ message: "Vendors can only add customers" });
//       }

//       if (req.user.userType === 3) { // Customers cannot add users
//         return res.status(403).json({ message: "Customers are not allowed to add users" });
//       }

//       // Admin can add any user
//       if (req.user.userType === 1) { // Admin can add anyone
//         // No restriction for admins here
//       }

//       const [existing] = await db.query(`SELECT * FROM user_data WHERE email = ?`, [email]);
//       if (existing.length > 0) {
//         return res.status(409).json({ message: "Email already exists" });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);
//       const created_by = req.user.id;

//       await db.query(`
//         INSERT INTO user_data (fname, lname, email, phoneNumber, password, userType, created_by)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//       `, [fname, lname, email, phoneNumber, hashedPassword, userType, created_by]);

//       return res.status(201).json({
//         success: true,
//         message: "User added successfully"
//       });

//     } catch (error) {
//       console.error("Error in addUser:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Server error",
//         error
//       });
//     }
//   };


export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Admin can delete anyone
        // Vendor can delete only users created by them
        // Customer can delete only self
        if (req.user.userType === 2) {
            const [check] = await db.query(`SELECT * FROM user_data WHERE id = ? AND created_by = ?`, [id, req.user.id]);
            if (check.length === 0) {
                return res.status(403).json({ message: "You can only delete your own customers" });
            }
        } else if (req.user.userType === 3 && parseInt(id) !== req.user.id) {
            return res.status(403).json({ message: "Customers can only delete their own account" });
        }

        await db.query(`DELETE FROM user_data WHERE id = ?`, [id]);
        res.status(200).json({ success: true, message: "User deleted successfully" });

    } catch (err) {
        console.error("DeleteUser Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fname, lname, email, phoneNumber, password, userType } = req.body;

        // Only allow updating own data
        if (req.user.userType !== 1 && parseInt(id) !== req.user.id) {
            return res.status(403).json({ message: "You can only edit your own profile" });
        }

        await db.query(`
        UPDATE user_data SET fname = ?, lname = ?, email=?,phoneNumber = ?, password=?,userType=? WHERE id = ?
      `, [fname, lname, email, phoneNumber, password, userType, id]);

        res.status(200).json({ success: true, message: "User updated successfully" });

    } catch (err) {
        console.error("UpdateUser Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getUsers = async (req, res) => {
    try {
        let query = `SELECT id, fname, lname, email, phoneNumber, userType, created_by FROM user_data`;
        let values = [];

        if (req.user.userType === 2) {
            query += ` WHERE created_by = ?`;
            values.push(req.user.id);
        }

        if (req.user.userType === 3) {
            query += ` WHERE id = ?`;
            values.push(req.user.id);
        }

        const [users] = await db.query(query, values);
        res.status(200).json({ success: true, users });

    } catch (err) {
        console.error("GetUsers Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const addUser = async (req, res) => {
    try {
        const { fname, lname, email, phoneNumber, password, userType } = req.body;

        if (!fname || !lname || !email || !phoneNumber || !password || !userType) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Role-based validation
        if (req.user.userType === 2 && userType === 3) {
            return res.status(403).json({ message: "Vendors can only add customers" });
        }
        if (req.user.userType === 3) {
            return res.status(403).json({ message: "Customers are not allowed to add users" });
        }

        const [existing] = await db.query(`SELECT * FROM user_data WHERE email = ?`, [email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const created_by = req.user.id;

        await db.query(`
        INSERT INTO user_data (fname, lname, email, phoneNumber, password, userType, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [fname, lname, email, phoneNumber, hashedPassword, userType, created_by]);

        res.status(201).json({ success: true, message: "User added successfully" });

    } catch (err) {
        console.error("AddUser Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};












 