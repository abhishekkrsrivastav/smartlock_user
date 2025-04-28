
import db from '../../config/db.js';

// export const saveImagePath = async (req, res) => {
//   try {
//     const { username, status_id, age_id, gender_id, image_path } = req.body;

//     if (!username || !status_id || !age_id || !gender_id || !image_path) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Check if user exists
//     const [existing] = await db.query("SELECT id FROM users WHERE username = ?", [username]);
//     let userId;

//     if (existing.length > 0) {
//       userId = existing[0].id;
//     } else {
//       const [insertUser] = await db.query(
//         "INSERT INTO users (username, status_id, age_id, gender_id) VALUES (?, ?, ?, ?)",
//         [username, status_id, age_id, gender_id]
//       );
//       userId = insertUser.insertId;
//     }

//     // Store image path
//     const [insertImage] = await db.query(
//       "INSERT INTO user_images (user_id, image_path) VALUES (?, ?)",
//       [userId, image_path]
//     );

//     res.status(200).json({
//       message: "Image path saved successfully",
//       user_id: userId,
//       image_id: insertImage.insertId,
//       path_stored: image_path,
//     });
//   } catch (error) {
//     console.error("Save path error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

 
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

    // Store image path(s)
    for (const imagePath of image_path) {
      await db.query(
        "INSERT INTO user_images (user_id, image_path) VALUES (?, ?)",
        [userId, imagePath]
      );
    }

    res.status(200).json({
      message: "Image paths saved successfully",
      user_id: userId,
    });
  } catch (error) {
    console.error("Error in saveImagePath:", error); // Log the error for debugging
    res.status(500).json({ error: "Server error", details: error.message });
  }
};




export const getUserByImagePath = async (req, res) => {
  try {
    const { image_path } = req.query;
    if (!image_path) {
      return res.status(400).json({ error: "image_path is required" });
    }
    const [imageData] = await db.query(`select user_id from user_images where image_path=?`, [image_path]);

    if (imageData.length === 0) {
      return res.status(404).json({ error: "No image found" });
    }
    const userID = imageData[0].user_id;

    const [userData] = await db.query(`select username,status_id,age_id,gender_id from users where id=?`, [userID]);
    if (userData.length === 0) {
      return res.status(404).json({ error: "No user found" });
    }
    res.status(200).json({
      message: "user matched successfully",
      user: userData[0],
      image_path
    })

  } catch (error) {
    console.error('Match error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}


export const getImage = async (req, res) => {
  try {

    const [imageData] = await db.query(`select image_path,user_id from user_images`);


    res.status(200).json({
      message: "image path successfully",
      image_path: imageData,
      user_id: imageData
    })

  } catch (error) {
    console.error('Match error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

