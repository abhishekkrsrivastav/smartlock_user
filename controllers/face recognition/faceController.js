
import db from '../../config/db.js';

// // export const saveImagePath = async (req, res) => {
// //   try {
// //     const { username, status_id, age_id, gender_id, image_path } = req.body;

// //     if (!username || !status_id || !age_id || !gender_id || !image_path) {
// //       return res.status(400).json({ error: "Missing required fields" });
// //     }

// //     // Check if user exists
// //     const [existing] = await db.query("SELECT id FROM users WHERE username = ?", [username]);
// //     let userId;

// //     if (existing.length > 0) {
// //       userId = existing[0].id;
// //     } else {
// //       const [insertUser] = await db.query(
// //         "INSERT INTO users (username, status_id, age_id, gender_id) VALUES (?, ?, ?, ?)",
// //         [username, status_id, age_id, gender_id]
// //       );
// //       userId = insertUser.insertId;
// //     }

// //     // Store image path
// //     const [insertImage] = await db.query(
// //       "INSERT INTO user_images (user_id, image_path) VALUES (?, ?)",
// //       [userId, image_path]
// //     );

// //     res.status(200).json({
// //       message: "Image path saved successfully",
// //       user_id: userId,
// //       image_id: insertImage.insertId,
// //       path_stored: image_path,
// //     });
// //   } catch (error) {
// //     console.error("Save path error:", error);
// //     res.status(500).json({ error: "Server error" });
// //   }
// // };


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

//     // Convert image_path to JSON format (array)
//     const imagePathsJSON = JSON.stringify(image_path); // Convert to JSON string if it's not already

//     // Store image paths in user_images table
//     await db.query(
//       "INSERT INTO user_images (user_id, image_path) VALUES (?, ?)",
//       [userId, imagePathsJSON]
//     );

//     res.status(200).json({
//       message: "Image paths saved successfully",
//       user_id: userId,
//     });
//   } catch (error) {
//     console.error("Error in saveImagePath:", error); // Log the error for debugging
//     res.status(500).json({ error: "Server error", details: error.message });
//   }
// };




// export const getUserByImagePath = async (req, res) => {
//   try {
//     const { image_path } = req.query;
//     if (!image_path) {
//       return res.status(400).json({ error: "image_path is required" });
//     }
//     const [imageData] = await db.query(`select user_id from user_images where image_path=?`, [image_path]);

//     if (imageData.length === 0) {
//       return res.status(404).json({ error: "No image found" });
//     }
//     const userID = imageData[0].user_id;

//     const [userData] = await db.query(`select username,status_id,age_id,gender_id from users where id=?`, [userID]);
//     if (userData.length === 0) {
//       return res.status(404).json({ error: "No user found" });
//     }
//     res.status(200).json({
//       message: "user matched successfully",
//       user: userData[0],
//       image_path
//     })

//   } catch (error) {
//     console.error('Match error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// }


// export const getImage = async (req, res) => {
//   try {

//     const [imageData] = await db.query(`select image_path,user_id from user_images`);


//     res.status(200).json({
//       message: "image path successfully",
//       image_path: imageData,
//       // user_id: imageData
//     })

//   } catch (error) {
//     console.error('Match error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// }



// // entry 

// // export const saveEntryLog = async (req, res) => {
// //   try {
// //     const { user_id, device_id, in_time, out_time, age_id, gender_id } = req.body;

// //     // if (!user_id || !device_id || !in_time || !age_id || !gender_id) {
// //     //   return res.status(400).json({ error: "Missing required fields" });
// //     // }

// //     await db.query(
// //       `INSERT INTO entrylog (user_id, device_id, in_time, out_time, age_id, gender_id)
// //        VALUES (?, ?, ?, ?, ?, ?)`,
// //       [user_id, device_id, in_time, out_time , age_id, gender_id]
// //     );

// //     res.status(200).json({ message: "Entry log saved successfully" });
// //   } catch (error) {
// //     console.error("Error in saveEntryLog:", error);
// //     res.status(500).json({ error: "Server error", details: error.message });
// //   }
// // };



// // final 

// export const addUserImage = async (req, res) => {
//   try {
//     const { user_id, image_path } = req.body;

//     // Check if user already has an entry in user_image table
//     const [existing] = await db.query(`SELECT * FROM user_image WHERE user_id = ?`, [user_id]);

//     if (existing.length > 0) {
//       // If exists, update the JSON array
//       const currentImages = JSON.parse(existing[0].image_path || '[]');
//       currentImages.push(image_path);

//       await db.query(
//         `UPDATE user_image SET image_path = ?, created_at = NOW() WHERE user_id = ?`,
//         [JSON.stringify(currentImages), user_id]
//       );

//       return res.status(200).json({
//         message: "Image path added to existing user",
//         image_path: currentImages,
//       });

//     } else {
//       // First time entry
//       await db.query(
//         `INSERT INTO user_image (user_id, image_path) VALUES (?, ?)`,
//         [user_id, JSON.stringify([image_path])]
//       );

//       return res.status(201).json({
//         message: "Image path added for new user",
//         image_path: [image_path],
//       });
//     }

//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };



// export const getUserImages = async (req, res) => {
//   try {
//     const { user_id } = req.params;
//     const [rows] = await db.query(`SELECT image_path FROM user_image WHERE user_id = ?`, [user_id]);

//     if (rows.length === 0) return res.status(404).json({ message: "No images found" });

//     res.status(200).json({ images: JSON.parse(rows[0].image_path) });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };




// export const getAllUserImages = async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       `SELECT user_id, image_path FROM user_image`
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "No images found" });
//     }

//     // Convert image_path JSON to array per user
//     const formatted = rows.map(row => ({
//       user_id: row.user_id,
//       images: JSON.parse(row.image_path)
//     }));

//     res.status(200).json({ success: true, data: formatted });

//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };



export const guestInWithImage = async (req, res) => {
  try {
    const { guest_name, age_id, gender_id, device_id, image_path } = req.body;

    const in_time = new Date().toISOString();

    // 1. Check full guest identity
    const [existing] = await db.query(
      `SELECT * FROM guest_visits 
       WHERE guest_name = ? AND age_id = ? AND gender_id = ? AND device_id = ?`,
      [guest_name, age_id, gender_id, device_id]
    );

    let guest_visit_id;

    if (existing.length > 0) {
      guest_visit_id = existing[0].id;

      const inTimes = JSON.parse(existing[0].in_times || "[]");
      inTimes.push(in_time);
      await db.query(
        "UPDATE guest_visits SET in_times = ? WHERE id = ?",
        [JSON.stringify(inTimes), guest_visit_id]
      );

    } else {
      const [result] = await db.query(
        `INSERT INTO guest_visits 
         (guest_name, age_id, gender_id, device_id, in_times) 
         VALUES (?, ?, ?, ?, ?)`,
        [guest_name, age_id, gender_id, device_id, JSON.stringify([in_time])]
      );
      guest_visit_id = result.insertId;
    }

    // 2. Insert image
    const [imageRow] = await db.query(
      "SELECT * FROM guest_images WHERE guest_visit_id = ?",
      [guest_visit_id]
    );

    if (imageRow.length > 0) {
      const paths = JSON.parse(imageRow[0].image_paths || "[]");
      paths.push(image_path);
      await db.query(
        "UPDATE guest_images SET image_paths = ? WHERE guest_visit_id = ?",
        [JSON.stringify(paths), guest_visit_id]
      );
    } else {
      await db.query(
        "INSERT INTO guest_images (guest_visit_id, image_paths) VALUES (?, ?)",
        [guest_visit_id, JSON.stringify([image_path])]
      );
    }

    res.status(201).json({
      message: "Guest IN recorded with identity check",
      in_time,
      guest_visit_id
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const AllGuestImages = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT gv.guest_name, gv.device_id, gi.image_paths 
       FROM guest_visits gv 
       LEFT JOIN guest_images gi ON gv.id = gi.guest_visit_id`
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};





// export const addLocationData = (req, res) => {
//   const { user_id, latitude, longitude } = req.body;

//   console.log("Received body:", req.body);  // Debug

//   if (!user_id || latitude === undefined || longitude === undefined) {
//     return res.status(400).json({ error: 'user_id, latitude, and longitude are required' });
//   }

//   // Use 'id' for ordering now
//   const lastLocationQuery = `
//     SELECT latitude, longitude 
//     FROM user_locations 
//     WHERE user_id = ? 
//     ORDER BY id DESC 
//     LIMIT 1
//   `;

//   db.query(lastLocationQuery, [user_id], (err, results) => {
//     if (err) {
//       console.error('Fetch Error:', err);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }

//     const last = results[0];

//    const isSameLocation =
//   last &&
//   Number(last.latitude).toFixed(6) === Number(latitude).toFixed(6) &&
//   Number(last.longitude).toFixed(6) === Number(longitude).toFixed(6);
// console.log("Last location from DB:", last);
// console.log("Current location:", { latitude, longitude });
// console.log("Comparison Result:", isSameLocation);


//     if (isSameLocation) {
//       return res.status(200).json({ message: 'Location not changed. Skipping insert.' });
//     }

//     const insertQuery = `
//       INSERT INTO user_locations (user_id, latitude, longitude)
//       VALUES (?, ?, ?)
//     `;

//     db.query(insertQuery, [user_id, latitude, longitude], (err, result) => {
//       if (err) {
//         console.error('Insert Error:', err);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }

//       res.status(201).json({ id: result.insertId });
//     });
//   });
// };


export const addLocationData = async(req, res) => {
  const { user_id, latitude, longitude } = req.body;

  if (!user_id || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'user_id, latitude, and longitude are required' });
  }


  const insertQuery = `
    INSERT INTO user_locations (user_id, latitude, longitude)
    VALUES (?, ?, ?)
  `;
 await db.query(insertQuery, [user_id, latitude, longitude], (err, result) => {
    if (err) {
      console.error('Insert Error:', err);   
      return res.status(500).json({ error: 'Insert failed' });
    }

    res.status(201).json({ id: result.insertId });
  });
};


