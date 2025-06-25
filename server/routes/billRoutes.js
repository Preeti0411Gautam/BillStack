import express from "express";
import { uploadBill, getBill, deleteBill ,getBillByType, togglePaymentStatus, updateBill, getBillsByMonth, getBillYearsByUser} from "../controllers/billController.js";
import { upload } from "../middlewares/multer.js";
import { metricsLogger } from "../middlewares/metricsLogger.js";
const router = express.Router();

router.use(metricsLogger);
router.post('/upload',upload.single('billImage'),uploadBill)
router.get('/getBillByTypes/:billType', getBillByType);
router.get('/getBillByUserId/:userId', getBill);
router.delete('/deleteBill/:id', deleteBill);
router.patch('/togglePayment/:id', togglePaymentStatus);
router.patch('/updateBillFile/:id', upload.single('billImage'), updateBill);
router.get("/filterByMonth", getBillsByMonth);
router.get('/getYears/:userId', getBillYearsByUser);

export default router;

