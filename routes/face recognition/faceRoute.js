import express from "express";
import { getImage, getUserByImagePath,   saveImagePath } from "../../controllers/face recognition/faceController.js";
 

const router = express.Router();
router.post("/save-path", saveImagePath);
router.get("/get-user-by-image", getUserByImagePath)
router.get("/get-image", getImage)
// router.post('/add-entrylog', saveEntryLog);
export default router;

