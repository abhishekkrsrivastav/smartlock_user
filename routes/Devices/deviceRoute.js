import express from "express";
import { addDevice, deleteDevice, editDevice, getDevice } from "../../controllers/devices/deviceController.js";

const router = express.Router();

router.post("/add-device", addDevice);
router.get("/get-device", getDevice)
router.put('/edit-device/:id', editDevice);
router.delete('/delete-device/:id', deleteDevice);

export default router;
