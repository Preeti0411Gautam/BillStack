import express from 'express';
import { verifyToken } from '../middlewares/verifyUser.js';
import { updateUser, signout, deleteUser } from '../controllers/userController.js';
import { metricsLogger } from '../middlewares/metricsLogger.js';
const router = express.Router();

router.use(metricsLogger);


router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId',verifyToken ,deleteUser);
router.post('/signout', signout);
export default router;