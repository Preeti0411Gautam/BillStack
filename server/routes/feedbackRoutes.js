import express from 'express';
import { uploadFeedback , getAllFeedbacks} from '../controllers/feedbackController.js';
import { metricsLogger } from '../middlewares/metricsLogger.js';
const router = express.Router();
router.use(metricsLogger);

router.post('/upload/:userId',uploadFeedback);
router.get('/feedbacks', getAllFeedbacks);

export default router;