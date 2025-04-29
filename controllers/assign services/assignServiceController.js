import db from '../../config/db.js';


export const addAIService = async (req, res) => {
    try {
      const { service_name, service_type, assignedUserEmail, assigned_device_code, status_id } = req.body;
  
      await db.query(
        `INSERT INTO ai_services (service_name, service_type, assignedUserEmail, assigned_device_code, status_id)
         VALUES (?, ?, ?, ?, ?)`,
        [service_name, service_type, assignedUserEmail, assigned_device_code, status_id]
      );
  
      res.status(201).json({ message: "AI service created successfully" });
    } catch (error) {
      console.error('Error creating AI service:', error);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  };
  

  export const getAIServices = async (req, res) => {
    try {
      const [rows] = await db.query(`SELECT * FROM ai_services`);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching AI services:', error);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  };
  

  export const getAIServiceById = async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await db.query(`SELECT * FROM ai_services WHERE id = ?`, [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'AI service not found' });
      }
  
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error fetching AI service:', error);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  };
  

  export const editAIService = async (req, res) => {
    try {
      const { id } = req.params;
      const { service_name, service_type, assignedUserEmail, assigned_device_code, status_id } = req.body;
  
      await db.query(
        `UPDATE ai_services 
         SET service_name = ?, service_type = ?, assignedUserEmail = ?, assigned_device_code = ?, status_id = ?
         WHERE id = ?`,
        [service_name, service_type, assignedUserEmail, assigned_device_code, status_id, id]
      );
  
      res.status(200).json({ message: "AI service updated successfully" });
    } catch (error) {
      console.error('Error updating AI service:', error);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  };
  

  export const deleteAIService = async (req, res) => {
    try {
      const { id } = req.params;
  
      await db.query(`DELETE FROM ai_services WHERE id = ?`, [id]);
  
      res.status(200).json({ message: "AI service deleted successfully" });
    } catch (error) {
      console.error('Error deleting AI service:', error);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  };
  
  