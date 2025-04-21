import express from "express";
import { getUserByImagePath, saveImagePath } from "../controllers/uploadController.js";

const router = express.Router();
router.post("/save-path", saveImagePath);
router.get("/get-user-by-image", getUserByImagePath)

export default router;

