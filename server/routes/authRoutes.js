import express from 'express';
import { signUp , login, signout} from '../controllers/authController.js';
import { metricsLogger } from '../middlewares/metricsLogger.js';

const router = express.Router();
router.use(metricsLogger);
router.post('/signup',signUp );
router.post('/login', login);
router.post('/signout', signout);

export default router;