import express from 'express';
import { createContactUs } from '../controllers/contactUsController.js';
const router = express.Router();

router.post('/upload',createContactUs);


export default router;