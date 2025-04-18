import express from "express";
import { saveImagePath } from "../controllers/uploadController.js";

const router = express.Router();
router.post("/save-path", saveImagePath);

export default router;

