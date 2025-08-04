import express from 'express';
import { verifyToken } from '../middlewares/verifyUser.js';
import { updateUser, deleteUser, getBillPreferences } from '../controllers/userController.js';
import { metricsLogger } from '../middlewares/metricsLogger.js';
import { csrfMiddleware } from '../middlewares/csrfMiddleware.js';
import { updateBillPreferences } from '../controllers/userController.js';

const router = express.Router();

router.use(metricsLogger);
router.use(verifyToken); // Protect all user routes


// Protect routes that modify data with CSRF middleware
router.patch('/update/:userId',csrfMiddleware, updateUser);
router.delete('/delete/:userId', csrfMiddleware, deleteUser);
router.put('/preferences/:userId', updateBillPreferences);

// The GET request for fetching preferences does not need CSRF protection
router.get('/preferences/:userId', getBillPreferences);

export default router;
