import db from "../../config/db.js"; // adjust the path based on your structure

// Create Service
export const addAIService = async (req, res) => {
  try {
    const { serviceName, serviceDescription } = req.body;
    await db.query(
      "INSERT INTO ai_services (service_name, service_description) VALUES (?, ?)",
      [serviceName, serviceDescription]
    );
    res.status(201).json({ message: "AI service created successfully" });
  } catch (error) {
    console.error("Error creating AI service:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Read All Services
export const getAllAIServices = async (req, res) => {
  try {
    const [services] = await db.query("SELECT * FROM ai_services ORDER BY id DESC");
    res.status(200).json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update Service
export const updateAIService = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceName, serviceDescription } = req.body;
    await db.query(
      "UPDATE ai_services SET service_name = ?, service_description = ? WHERE id = ?",
      [serviceName, serviceDescription, id]
    );
    res.status(200).json({ message: "Service updated successfully" });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete Service
export const deleteAIService = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM ai_services WHERE id = ?", [id]);
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ error: "Server error" });
  }
};
