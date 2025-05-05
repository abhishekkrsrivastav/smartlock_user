import express from 'express';
import { requireSignIn } from '../../middleware/smartLock/requireSignIn.js';
import {
  addDevice,
  getDevices,
  updateDevice,
  deleteDevice
} from '../../controllers/devices/deviceController.js';

const router = express.Router();

// All routes require user to be signed in
router.post('/add-device', requireSignIn, addDevice);            
router.get('/get-device', requireSignIn, getDevices);              
router.put('/update/:id', requireSignIn, updateDevice);         
router.delete('/delete/:id', requireSignIn, deleteDevice);       

export default router;

