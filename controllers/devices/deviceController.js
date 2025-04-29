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

// get data of device
export const getDevice = async (req, res) => {
    try {
        const [deviceData] = await db.query(`SELECT * FROM devices`);

        if (deviceData.length === 0) {
            return res.status(404).json({
                message: "No devices found"
            });
        }

        res.status(200).json({
            message: "Devices fetched successfully",
            devices: deviceData
        });

    } catch (error) {
        console.error('Error fetching devices:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};


// delete device
export const deleteDevice = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(`DELETE FROM devices WHERE id = ?`, [id]);

        res.status(200).json({ message: "Device deleted successfully" });
    } catch (error) {
        console.error('Error deleting device:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
}

// update device

export const editDevice = async (req, res) => {
    try {
        const { id } = req.params;
        const { deviceCode, deviceName, assignedUserEmail } = req.body;

        await db.query(
            `UPDATE devices SET deviceCode = ?, deviceName = ?, assignedUserEmail = ? WHERE id = ?`,
            [deviceCode, deviceName, assignedUserEmail, id]
        );

        res.status(200).json({ message: "Device updated successfully" });
    } catch (error) {
        console.error('Error updating device:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
}
