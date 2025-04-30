import express from 'express';
import {
    addAssignService,
    getAssignServices,
    updateAssignService,
    deleteAssignService,
} from '../../controllers/assign services/assignServiceController.js';

const router = express.Router();

router.post('/add-assignservice', addAssignService);
router.get('/get-assignservices', getAssignServices);
router.put('/edit-assignservice/:id', updateAssignService);
router.delete('/delete-assignservice/:id', deleteAssignService);

export default router;
