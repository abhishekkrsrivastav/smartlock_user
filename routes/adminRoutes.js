import express from "express";
import { loginAdmin, addVendor, getVendor, deleteVendor, UpdateVendor } from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.put("/login", loginAdmin);
router.post("/add-vendor", verifyToken, addVendor);
router.get("/get-vendor", verifyToken, getVendor);
router.delete("/delete-vendor/:id", verifyToken, deleteVendor);
router.put("/edit-vendor/:id", verifyToken, UpdateVendor);

export default router;
