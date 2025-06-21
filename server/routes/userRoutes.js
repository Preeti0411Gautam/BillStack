import express from 'express';
const router = express.Router();
// import { signUp, login } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/verifyUser.js';
import { updateUser, signout, deleteUser } from '../controllers/userController.js';



router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId',verifyToken ,deleteUser);
router.post('/signout', signout);
router.delete('/delete/:userId',verifyToken, deleteUser);
export default router;