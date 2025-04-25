import express from 'express';
import { getResponse, askKeyword, saveSentence } from '../../controllers/voice command/voiceController.js';

const router = express.Router();


router.post('/askquestion', askKeyword);
router.post('/getresponse', getResponse);

// save keyword in db from client
router.post('/save-sentence', saveSentence)


export default router;