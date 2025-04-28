import db from '../../config/db.js';


export const getUser = async (req, res) => {
    try {
        const [userData] = await db.query(`SELECT * FROM user_data`);

        if (userData.length === 0) {
            return res.status(404).json({
                message: "No user found"
            });
        }

        res.status(200).json({
            message: "Users fetched successfully",
            users: userData
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};