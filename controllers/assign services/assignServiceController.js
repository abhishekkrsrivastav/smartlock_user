import db from '../../config/db.js';

// ➕ Add Assign Service
export const addAssignService = async (req, res) => {
  try {
    const { ai_services_id, assignedUserEmail, assigned_device_code, status_id } = req.body;

    await db.query(
      `INSERT INTO assign_services (ai_services_id, assignedUserEmail, assigned_device_code, status_id)
       VALUES (?, ?, ?, ?)`,
      [ai_services_id, assignedUserEmail, assigned_device_code, status_id]
    );

    res.status(201).json({ message: "Assigned service created successfully" });
  } catch (error) {
    console.error('Error creating assigned service:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// 📥 Get All Assigned Services (with service name)
export const getAssignServices = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT 
         a.id, 
         s.service_name, 
         a.assignedUserEmail, 
         a.assigned_device_code, 
         a.status_id 
       FROM assign_services a
       JOIN ai_services s ON a.ai_services_id = s.id`
    );

    res.status(200).json({ services: results });
  } catch (error) {
    console.error('Error fetching assigned services:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// ✏️ Update Assign Service
export const updateAssignService = async (req, res) => {
  try {
    const { id } = req.params;
    const { ai_services_id, assignedUserEmail, assigned_device_code, status_id } = req.body;

    await db.query(
      `UPDATE assign_services 
       SET ai_services_id = ?, assignedUserEmail = ?, assigned_device_code = ?, status_id = ?
       WHERE id = ?`,
      [ai_services_id, assignedUserEmail, assigned_device_code, status_id, id]
    );

    res.status(200).json({ message: "Assigned service updated successfully" });
  } catch (error) {
    console.error('Error updating assigned service:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

 
export const deleteAssignService = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`DELETE FROM assign_services WHERE id = ?`, [id]);

    res.status(200).json({ message: "Assigned service deleted successfully" });
  } catch (error) {
    console.error('Error deleting assigned service:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
