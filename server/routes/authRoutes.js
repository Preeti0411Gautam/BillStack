import express from 'express';
import { signUp , login} from '../controllers/authController.js';
// import { deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup',signUp );
router.post('/login', login);

export default router;