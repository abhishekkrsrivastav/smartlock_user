import db from '../../config/db.js';

// Adding device to user
export const addDevice = async (req, res) => {
  try {
    const { deviceCode, deviceName, assignedUserEmail } = req.body;

    if (!deviceCode || !deviceName || !assignedUserEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const creatorId = req.user.id;
    const creatorRole = req.user.userType;

    if (creatorRole === 3) {
      return res.status(403).json({ error: "Customers are not allowed to add devices" });
    }

    const [user] = await db.query(`SELECT * FROM user_data WHERE email = ?`, [assignedUserEmail]);

    if (user.length === 0) {
      return res.status(404).json({ error: "Assigned user not found" });
    }

    if (creatorRole === 2 && user[0].created_by !== creatorId) {
      return res.status(403).json({ error: "Vendors can only assign devices to their own customers" });
    }

    const [existing] = await db.query(`SELECT id FROM devices WHERE deviceCode = ?`, [deviceCode]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Device code already exists" });
    }

    const [result] = await db.query(
      `INSERT INTO devices (deviceCode, deviceName, assignedUserEmail, created_by) VALUES (?, ?, ?, ?)`,
      [deviceCode, deviceName, assignedUserEmail, creatorId]
    );

    res.status(201).json({
      success: true,
      message: "Device added successfully",
      device: {
        id: result.insertId,
        deviceCode,
        deviceName,
        assignedUserEmail
      }
    });

  } catch (error) {
    console.error("Error in addDevice:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

  


// get data of device
export const getDevices = async (req, res) => {
  try {
    const { id, userType, email } = req.user;

    let query = '';
    let params = [];

    if (userType === 1) {
      query = `SELECT * FROM devices`;
    } else if (userType === 2) {
      query = `SELECT * FROM devices WHERE created_by = ?`;
      params = [id];
    } else if (userType === 3) {
      query = `SELECT * FROM devices WHERE assignedUserEmail = ?`;
      params = [email];
    }

    const [devices] = await db.query(query, params);

    res.status(200).json({ success: true, devices });

  } catch (error) {
    console.error("Error in getDevices:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

  


// delete device
export const deleteDevice = async (req, res) => {
  try {
    const { id: deviceId } = req.params;
    const { id: userId, userType, email } = req.user;

    const [deviceData] = await db.query(`SELECT * FROM devices WHERE id = ?`, [deviceId]);

    if (deviceData.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }

    const device = deviceData[0];

    if (userType === 2 && device.created_by !== userId) {
      return res.status(403).json({ error: "Vendors can only delete their own devices" });
    }

    if (userType === 3 && device.assignedUserEmail !== email) {
      return res.status(403).json({ error: "Customers can only delete their own devices" });
    }

    await db.query(`DELETE FROM devices WHERE id = ?`, [deviceId]);

    res.status(200).json({ success: true, message: "Device deleted successfully" });

  } catch (error) {
    console.error("Error in deleteDevice:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};


// update device

export const updateDevice = async (req, res) => {
  try {
    const { deviceName, assignedUserEmail } = req.body;
    const { id: deviceId } = req.params;

    if (!deviceName || !assignedUserEmail) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const { id: userId, userType, email } = req.user;

    const [deviceData] = await db.query(`SELECT * FROM devices WHERE id = ?`, [deviceId]);

    if (deviceData.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }

    const device = deviceData[0];

    if (userType === 2 && device.created_by !== userId) {
      return res.status(403).json({ error: "Vendors can only update their own devices" });
    }

    if (userType === 3 && device.assignedUserEmail !== email) {
      return res.status(403).json({ error: "Customers can only update their own devices" });
    }

    await db.query(
      `UPDATE devices SET deviceName = ?, assignedUserEmail = ? WHERE id = ?`,
      [deviceName, assignedUserEmail, deviceId]
    );

    res.status(200).json({ success: true, message: "Device updated successfully" });

  } catch (error) {
    console.error("Error in updateDevice:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

  
