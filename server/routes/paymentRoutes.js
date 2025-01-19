import express from 'express';
import { createOrder, getAllPaymentHistory, verifyPayment} from '../controllers/paymentController.js';
const router = express.Router();

router.post('/createOrder', createOrder);
router.post('/verifyPayment', verifyPayment);
router.get('/history/:userId',getAllPaymentHistory);

export default router;
