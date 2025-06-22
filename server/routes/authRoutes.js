import express from 'express';
import { signUp , login} from '../controllers/authController.js';
import { metricsLogger } from '../middlewares/metricsLogger.js';

const router = express.Router();
router.use(metricsLogger);
router.post('/signup',signUp );
router.post('/login', login);

export default router;