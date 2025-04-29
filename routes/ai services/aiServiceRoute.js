import express from "express";
import {
    addAIService,
    getAllAIServices,
    updateAIService,
    deleteAIService,
} from "../../controllers/ai services/aiServiceController.js";

const router = express.Router();

// Create
router.post("/add-service", addAIService);

// Read
router.get("/get-services", getAllAIServices);

// Update
router.put("/edit-service/:id", updateAIService);

// Delete
router.delete("/delete-service/:id", deleteAIService);

export default router;
