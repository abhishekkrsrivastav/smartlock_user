import express from "express";
import { addDevice, getDevice } from "../../controllers/devices/deviceController.js";


const router = express.Router();


router.post("/add-device", addDevice);
router.get("/get-device", getDevice)


export default router;
