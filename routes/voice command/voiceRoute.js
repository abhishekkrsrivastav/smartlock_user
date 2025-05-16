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

// final api for voice commad 


/**
 * @swagger
 * /voice-command:
 *   post:
 *     summary: Add voice command flow data (category, action, keywords, responses)
 *     tags: [Voice Commands]
 *     description: >
 *       This API inserts multilingual voice command data for a lock system.  
 *       It creates categories, actions (with questions), keywords, and response mappings.  
 *       You can specify the language (default is `en`).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_name
 *               - actions
 *             properties:
 *               category_name:
 *                 type: string
 *                 example: locksystem
 *               language_code:
 *                 type: string
 *                 example: hi
 *               actions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - action_name
 *                     - keywords
 *                     - question_text
 *                     - responses
 *                   properties:
 *                     action_name:
 *                       type: string
 *                       example: lock
 *                     keywords:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["दरवाजा बंद करो", "lock karo"]
 *                     question_text:
 *                       type: string
 *                       example: आप क्या लॉक करना चाहते हैं? दरवाजा, लॉक, मुख्य दरवाजा, पीछे का दरवाजा ?
 *                     responses:
 *                       type: object
 *                       additionalProperties:
 *                         type: string
 *                       example:
 *                         mukhya darvaja: मुख्य दरवाजा अब लॉक कर दिया गया है।
 *                         lock: लॉक अब एंगेज हो गया है।
 *                         default: दरवाज़ा अब लॉक कर दिया गया है। आप सुरक्षित हैं!
 *     responses:
 *       201:
 *         description: Voice command data inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Voice command data inserted successfully
 *       500:
 *         description: Internal server error while saving data
 */


router.post('/voice-command', addVoiceFlowData);

/**
 * @swagger
 * /detect-intent:
 *   post:
 *     summary: Detect intent from spoken text
 *     tags: [Voice Commands]
 *     description: >
 *       Matches a spoken keyword with the database and returns the related action, 
 *       including action ID, name, and associated question text.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - spoken_text
 *             properties:
 *               spoken_text:
 *                 type: string
 *                 example: दरवाजा खोलो
 *               language_code:
 *                 type: string
 *                 default: en
 *                 example: hi
 *     responses:
 *       200:
 *         description: Matching keyword found and action returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 action_id:
 *                   type: integer
 *                   example: 5
 *                 action_name:
 *                   type: string
 *                   example: unlock
 *                 question:
 *                   type: string
 *                   example: आप क्या अनलॉक करना चाहते हैं? दरवाजा, लॉक, मुख्य दरवाजा, पीछे का दरवाजा ?
 *       404:
 *         description: No matching keyword found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No matching keyword found.
 *       500:
 *         description: Server error while detecting intent
 */


router.post("/detect-intent", detectIntent);

/**
 * @swagger
 * /get-responses:
 *   post:
 *     summary: Get response based on user input and action
 *     tags: [Voice Commands]
 *     description: >
 *       This endpoint returns a matching response for a given `action_id` and `user_input` in a specific language.
 *       
 *       - If an **exact match** is found for the user input, it returns the matching response.
 *       
 *       - If **no exact match** is found, the system:
 *         - Returns a **default fallback response** for the action (if available).
 *         - Logs the **unknown user input** into the `unknown_inputs` table for future training/improvement.
 *       
 *       If no match or default is found, returns a 404.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action_id
 *               - user_input
 *             properties:
 *               action_id:
 *                 type: integer
 *                 example: 5
 *               user_input:
 *                 type: string
 *                 example: piche ka darvaja
 *               language_code:
 *                 type: string
 *                 default: en
 *                 example: hi
 *     responses:
  *       200:
 *         description: Matched response or fallback with saved input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: दरवाज़ा पूरी तरह से लॉक है!
 *                 savedData:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     insertId:
 *                       type: integer
 *                       example: 101
 *                     user_input:
 *                       type: string
 *                       example: piche ka dwar
 *                     action_id:
 *                       type: integer
 *                       example: 5

 *       404:
 *         description: No response or default found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No response found.
 *       500:
 *         description: Internal server error
 */



router.post("/get-responses", getResponses);

export default router;





