import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { getUserData, getAllUsers } from '../controllers/user.controller.js';
import roleMiddleware from '../middlewares/role.middleware.js'
const userRouter = express.Router();

userRouter.get('/data', authMiddleware, getUserData);
userRouter.get('/', authMiddleware, roleMiddleware(['admin']), getAllUsers);

export default userRouter;