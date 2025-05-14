import express from "express";
import { addUserImage, getImage, getUserByImagePath,   getUserImages,   saveImagePath } from "../../controllers/face recognition/faceController.js";
 

const router = express.Router();
router.post("/save-path", saveImagePath);
router.get("/get-user-by-image", getUserByImagePath)
router.get("/get-image", getImage)
// router.post('/add-entrylog', saveEntryLog);


// final
router.post("/add-image", addUserImage);         // Add new image (append to existing)
router.get("/get-image/:user_id", getUserImages); // Get all images of a user

export default router;

