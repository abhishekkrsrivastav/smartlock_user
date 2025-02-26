import express from 'express';
import { getResponse, askKeyword} from '../controllers/keywordController.js';

const router = express.Router();


router.post('/askquestion', askKeyword);
router.post('/getresponse', getResponse);

export default router;