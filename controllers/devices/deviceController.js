import db from '../../config/db.js';

// Adding device to user
export const addDevice = async (req, res) => {
  try {
    const { deviceCode, deviceName, assigned_user_id } = req.body;

    if (!deviceCode || !deviceName || !assigned_user_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const creatorId = req.user.id;
    const creatorRole = req.user.userType;

    if (creatorRole === 3) {
      return res.status(403).json({ error: "Customers are not allowed to add devices" });
    }

    const [user] = await db.query(`SELECT * FROM user_data WHERE id = ?`, [assigned_user_id]);

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
      `INSERT INTO devices (deviceCode, deviceName, assigned_user_id , created_by) VALUES (?, ?, ?, ?)`,
      [deviceCode, deviceName, assigned_user_id, creatorId]
    );

    res.status(201).json({
      success: true,
      message: "Device added successfully",
      device: {
        id: result.insertId,
        deviceCode,
        deviceName,
        assigned_user_id
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
      query = `SELECT * FROM devices WHERE assigned_user_id  = ?`;
      params = [id];
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
    const { id: userId, userType } = req.user;

    const [deviceData] = await db.query(`SELECT * FROM devices WHERE id = ?`, [deviceId]);

    if (deviceData.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }

    const device = deviceData[0];

    // Vendor check
    if (userType === 2 && device.created_by !== userId) {
      return res.status(403).json({ error: "Vendors can only delete their own devices" });
    }

    // Customer check
    if (userType === 3 && device.assigned_user_id !== userId) {
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
    const { deviceName, assigned_user_id } = req.body;
    const { id: deviceId } = req.params;

    if (!deviceName || !assigned_user_id) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const { id: userId, userType } = req.user;

    const [deviceData] = await db.query(`SELECT * FROM devices WHERE id = ?`, [deviceId]);

    if (deviceData.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }

    const device = deviceData[0];

    // Vendor check
    if (userType === 2 && device.created_by !== userId) {
      return res.status(403).json({ error: "Vendors can only update their own devices" });
    }

    // Customer check
    if (userType === 3 && device.assigned_user_id !== userId) {
      return res.status(403).json({ error: "Customers can only update their own devices" });
    }

    await db.query(
      `UPDATE devices SET deviceName = ?, assigned_user_id = ? WHERE id = ?`,
      [deviceName, assigned_user_id, deviceId]
    );

    res.status(200).json({ success: true, message: "Device updated successfully" });

  } catch (error) {
    console.error("Error in updateDevice:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};




export const logEntry = async (req, res) => {
  try {
    const { user_id, device_id, access_type, age_id, gender_id } = req.body;
    const userType = req.user.userType;

    // Check for valid access_type
    if (!["in", "out"].includes(access_type)) {
      return res.status(400).json({ message: "Invalid access_type, use 'in' or 'out'" });
    }

    if (access_type === "in") {
      // Insert new IN record
      await db.query(
        `INSERT INTO entrylog (user_id, device_id, in_time, age_id, gender_id)
         VALUES (?, ?, NOW(), ?, ?)`,
        [user_id, device_id, age_id || null, gender_id || null]
      );
      return res.status(201).json({ message: "In-time logged" });
    }

    if (access_type === "out") {
      // Find latest IN record without OUT
      const [rows] = await db.query(
        `SELECT * FROM entrylog 
         WHERE user_id = ? AND device_id = ? AND out_time IS NULL 
         ORDER BY in_time DESC LIMIT 1`,
        [user_id, device_id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "No in-time found for out-time update" });
      }

      // Update out_time in that record
      await db.query(
        `UPDATE entrylog SET out_time = NOW() WHERE id = ?`,
        [rows[0].id]
      );

      return res.status(200).json({ message: "Out-time updated" });
    }

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const getEntry = async (req, res) => {
  try {
    const userType = req.user.userType;
    const userId = req.user.id;

    let query = '';
    let params = [];

    if (userType === 1) {
      // Admin can see all logs
      query = `SELECT * FROM entrylog`;
    } else if (userType === 2) {
      // Vendor can see logs of their created customers
      query = `
        SELECT e.* FROM entrylog e
        JOIN user_data u ON e.user_id = u.id
        WHERE u.created_by = ?
      `;
      params = [userId];
    } else {
      // Customer can only see their own logs
      query = `SELECT * FROM entrylog WHERE user_id = ?`;
      params = [userId];
    }

    const [logs] = await db.query(query, params);

    if (logs.length === 0) {
      return res.status(404).json({ message: "No entry logs found" });
    }

    res.status(200).json({ success: true, logs });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const registerDevice = async (req, res) => {
  try {
    const { deviceName } = req.body;
    const created_by = req.user.id;  //taking id for admin 

    const deviceCode = "XRDA3-" + Math.random().toString(36).substring(2, 10).toUpperCase(); // making deviceCode unique by admin

    const [result] = await db.query(`insert into devices (deviceCode, deviceName, status_id, created_by) values (?, ?, ?, ?)`
      , [deviceCode, deviceName, 4, created_by]);

    res.status(201).json({
      success: true,
      message: "Device registered successfully",
      deviceCode,
      deviceId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });

  }
}


// 
export const activateDevice = async (req, res) => {
  try {
    const { deviceCode, phone_number } = req.body;

    const userType = req.user.userType;

    if (userType !== 2) {
      return res.status(403).json({ message: "Only vendors can activate devices." })
    }

    const [device] = await db.query(`select * from devices where deviceCode= ?`, [deviceCode])

    if (device.length === 0) {
      return res.status(404).json({ message: "Device not found" });
    }

    if (device[0].status_id === 3) {
      return res.status(400).json({ message: "Device already activated" });
    }

    await db.query(
      `UPDATE devices SET phone_number = ?, status_id = 3 WHERE deviceCode = ?`,
      [phone_number, deviceCode]
    );
    res.status(200).json({ message: "Device activated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });

  }
};


export const getMyDevice = async (req, res) => {
  try {
    const { phone_number, userType } = req.user; // from JWT decoded token
    console.log(req.user);
    

    if (userType !== 3) {
      return res.status(403).json({ message: "Only customers can access this route" });
    }

    const [device] = await db.query(
      `SELECT deviceCode, deviceName, status_id FROM devices WHERE phone_number = ?`,
      [phone_number]
    );

    if (device.length === 0) {
      return res.status(404).json({ message: "No device found for your number" });
    }

    res.status(200).json({ device });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




 export const getDeviceByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    const [device] = await db.query(
      `SELECT deviceCode, deviceName, status_id FROM devices WHERE phone_number = ?`,
      [phone]
    );

    if (device.length === 0) {
      return res.status(404).json({ message: "No device found for this phone number" });
    }

    res.status(200).json({ device });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

