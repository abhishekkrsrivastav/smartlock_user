import express from 'express';
import {getNavbar} from '../controllers/navbarController.js'
const router = express.Router();

router.get('/navbar', getNavbar);


export default router;