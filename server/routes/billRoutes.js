import express from "express";
import { uploadBill, getBill, deleteBill ,getBillsByType } from "../controllers/billController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.post('/upload',upload.single('billImage'),uploadBill)
router.get('/getBillByTypes/:billType', getBillsByType);
router.get('/getBillByUserId/:userId', getBill);
router.delete('/deleteBill/:id', deleteBill);
// router.post('/payment',payBill);
export default router;
