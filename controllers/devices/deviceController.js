import db from '../../config/db.js';

// Adding device to user
export const addDevice = async (req, res) => {
    try {
        const { deviceCode, deviceName, assignedUserEmail } = req.body;
 
        if (!deviceCode || !deviceName || !assignedUserEmail) {
            return res.status(400).json({ error: "Missing required fields" });
        }

      
        const [existing] = await db.query("SELECT id FROM user_data WHERE email = ?", [assignedUserEmail]);

        if (existing.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        
        const [result] = await db.query(
            `INSERT INTO devices (deviceCode, deviceName, assignedUserEmail) VALUES (?, ?, ?)`,
            [deviceCode, deviceName, assignedUserEmail]
        );

        res.status(200).json({
            message: "Device saved successfully",
            device: {
                id: result.insertId,
                deviceCode,
                deviceName,
                assignedUserEmail
            }
        });

    } catch (error) {
        console.error("Error in adding device:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

