import express from 'express';
import { addAIService, deleteAIService, editAIService, getAIServiceById, getAIServices } from '../../controllers/assign services/assignServiceController.js';

const router = express.Router();

router.post('/add-aiservices', addAIService);
router.get('/get-aiservices', getAIServices);
router.get('/get-aiservices/:id', getAIServiceById);
router.put('/edit-aiservices/:id', editAIService);
router.delete('/delete-aiservices/:id', deleteAIService);

export default router;
