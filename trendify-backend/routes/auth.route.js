import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail, matchResetOTP } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js'

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', authMiddleware, sendVerifyOtp);
authRouter.post('/verify-account', authMiddleware, verifyEmail);
authRouter.get('/is-auth', authMiddleware, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password',resetPassword);
authRouter.post('/match-otp', matchResetOTP);

export default authRouter;
