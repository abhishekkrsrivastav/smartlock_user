import express from "express";
import { addDevice } from "../../controllers/devices/deviceController.js";
 

const router = express.Router();


router.post("/add-device", addDevice);
 

export default router;
