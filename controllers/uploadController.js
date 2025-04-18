
import db from '../config/db.js';

export const saveImagePath = async (req, res) => {
  try {
    const { username, status_id, age_id, gender_id, image_path } = req.body;

    if (!username || !status_id || !age_id || !gender_id || !image_path) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user exists
    const [existing] = await db.query("SELECT id FROM users WHERE username = ?", [username]);
    let userId;

    if (existing.length > 0) {
      userId = existing[0].id;
    } else {
      const [insertUser] = await db.query(
        "INSERT INTO users (username, status_id, age_id, gender_id) VALUES (?, ?, ?, ?)",
        [username, status_id, age_id, gender_id]
      );
      userId = insertUser.insertId;
    }

    // Store image path
    const [insertImage] = await db.query(
      "INSERT INTO user_images (user_id, image_path) VALUES (?, ?)",
      [userId, image_path]
    );

    res.status(200).json({
      message: "Image path saved successfully",
      user_id: userId,
      image_id: insertImage.insertId,
      path_stored: image_path,
    });
  } catch (error) {
    console.error("Save path error:", error);
    res.status(500).json({ error: "Server error" });
  }
};