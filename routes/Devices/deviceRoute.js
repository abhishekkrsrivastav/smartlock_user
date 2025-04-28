import express from "express";
import { addDevice } from "../../controllers/devices/deviceController";
 

const router = express.Router();


router.post("/add-device", addDevice);
 

export default router;
