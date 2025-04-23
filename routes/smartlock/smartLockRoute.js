import express from 'express';
import { create, login } from '../../controllers/smartLock/smartLockController.js';


const router = express.Router();

router.post("/login", login);
router.post("/create", create);

export default router;