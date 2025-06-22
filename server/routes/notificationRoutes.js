import express from 'express';
import { 
  getUpcomingBillNotifications, 
  getMissingBillNotifications 
} from '../controllers/notificationController.js';
import { metricsLogger } from '../middlewares/metricsLogger.js';

const router = express.Router();

router.use(metricsLogger);
router.get('/due-date/:userId', getUpcomingBillNotifications);
router.get('/upload-reminders/:userId', getMissingBillNotifications);

export default router;