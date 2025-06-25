import express from 'express';
import { verifyToken } from '../middlewares/verifyUser.js';
import { updateUser, deleteUser } from '../controllers/userController.js';
import { metricsLogger } from '../middlewares/metricsLogger.js';
import { csrfMiddleware } from '../middlewares/csrfMiddleware.js';

const router = express.Router();

router.use(metricsLogger);
router.use(verifyToken, csrfMiddleware); // Protect all user routes


router.patch('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId',verifyToken ,deleteUser);
export default router;