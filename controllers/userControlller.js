import db from "../config/db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const getUser = async (req, res) => {
    try {
        const data = await db.query('SELECT * FROM users')
        if (!data) {
            return res.status(404).send({
                success: false,
                message: 'No Records found',
            })
        }
        res.status(200).send({
            success: true,
            message: 'All Users Records',
            totalUsers: data[0].length,
            // data: data[0]
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in get all user API',
            error
        })

    }

}

// get user by id
// export const getUserById = async (req, res) => {
//     try {
//         const userId = req.params.id
//         if (!userId) {
//             return res.status(404).send({
//                 success: false,
//                 message: 'Invalid Or Provide User id',
//             })
//         }
//         const data = await db.query(`SELECT * FROM users WHERE id=?`, [userId])
//         if (!data) {
//             return res.status(404).send({
//                 success: false,
//                 message: 'No Records found',
//             })
//         }
//         res.status(200).send({
//             success: true,
//             userDetails: data[0],
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             message: 'Error in get  user  by ID',
//             error
//         })
//     }

// }

// create user registraion

export const createUser = async (req, res) => {
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
            message: "New user created successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in create  user api',
            error
        })
    }
}




// login for user

export const loginUser = async (req, res) => {
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
                message: 'User not found',
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
            { expiresIn: '1h' }
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

//update user

// export const updateUser = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         if (!userId) {
//             return res.status(404).send({
//                 success: false,
//                 message: 'Invalid ID or provide ID',
//             })
//         }
//         const { username, email, phoneNumber, password } = req.body;
//         const data = await db.query(`UPDATE users SET username = ?, email =?, phoneNumber=?,password=? WHERE id=?`, [username, email, phoneNumber, password])
//         if (!data) {
//             return res.status(404).send({
//                 success: false,
//                 message: 'Error in Update query',
//             })
//         }
//         res.status(200).send({
//             success: true,
//             message: "User details successfully",
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             message: 'Error in update user api',
//             error
//         })
//     }

// }


// logout

export const logoutUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).send({
                success: false,
                message: "No token provided"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userType = decoded.userType;
        await db.query("INSERT INTO token_blacklist (token) VALUES (?)", [token]);
        res.status(200).send({
            success: true,
            message: "Logout successfully",
            userType: `${userType}`
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in logout Api",
            error
        })

    }
}

