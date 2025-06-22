import express from 'express';
import { createContactUs } from '../controllers/contactUsController.js';
import { metricsLogger } from '../middlewares/metricsLogger.js';
const router = express.Router();
router.use(metricsLogger);

router.post('/upload',createContactUs);


export default router;