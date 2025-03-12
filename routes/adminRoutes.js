import express from "express";
import { addUser, getUsers, deleteUser } from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add-user", verifyToken, addUser);
router.get("/get-users", verifyToken, getUsers);
router.delete("/delete-user/:id", verifyToken, deleteUser);

export default router;
