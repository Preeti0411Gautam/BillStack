import express from 'express';
import { 
  getUpcomingBillNotifications, 
  getMissingBillNotifications 
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/due-date/:userId', getUpcomingBillNotifications);
router.get('/upload-reminders/:userId', getMissingBillNotifications);

export default router;