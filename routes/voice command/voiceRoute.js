import express from 'express';
import { getResponse, askKeyword, saveSentence, addVoiceFlowData, getResponses, detectIntent } from '../../controllers/voice command/voiceController.js';

// import {
//     createRecord,
//     getRecord,
//     updateRecord,
//     deleteRecord
// } from "../../controllers/voice command/voiceController.js";



const router = express.Router();


router.post('/askquestion', askKeyword);
router.post('/getresponse', getResponse);

// save keyword in db from client
router.post('/save-sentence', saveSentence)


// scalable api for all tables

// router.post("/:table", createRecord);
// router.get("/:table/:id?", getRecord);
// router.put("/:table/:id", updateRecord);
// router.delete("/:table/:id", deleteRecord);

// // new
// router.post("/insert", insertFullIntent);

// router.post('/data-entry', addData);


router.post('/voice-command', addVoiceFlowData);
router.post("/detect-intent", detectIntent);
router.post("/get-responses", getResponses);

export default router;





