import express from 'express';
const router = express.Router();
import { uploadFeedback , getAllFeedbacks} from '../controllers/feedbackController.js';

router.post('/upload/:userId',uploadFeedback);
router.get('/feedbacks', getAllFeedbacks);

export default router;