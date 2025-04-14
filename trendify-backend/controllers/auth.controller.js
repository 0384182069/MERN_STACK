import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import cartModel from '../models/cart.model.js';
import transporter from '../config/nodemailer.js';

const accessTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 5 * 60 * 1000, 
};

const refreshTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, 
};

const generateAccessToken = (userId, userRole) => {
    return jwt.sign(
        { 
            id: userId,
            role: userRole,

        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '5m' }
    );
};

const generateRefreshToken = (userId, userRole) => {
    return jwt.sign(
        { 
            id: userId,
            role: userRole,

        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
    
};

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Missing required details: name, email, and password are mandatory.' 
        });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: 'User already exists.' 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = new userModel({ 
            name, 
            email, 
            password: hashedPassword
        });
        await user.save();
        
        const newCart = new cartModel({
            userId: user._id,
            products: [],
            totalCartPrice: 0
        });
        await newCart.save();
        
        // Cập nhật cart trong user
        user.cart = newCart._id;
        await user.save();

        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id, user.role);

        res.cookie('accessToken', accessToken, accessTokenOptions);
        res.cookie('refreshToken', refreshToken, refreshTokenOptions);

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Trendify',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;">
                    <h2 style="color: #007bff;">Welcome to Trendify!</h2>
                    <p style="font-size: 18px;">Your account has been successfully created.</p>
                    <p style="font-size: 16px;">Email registered: <strong>${email}</strong></p>
                    <br>
                    <p>Start exploring now: <a href="https://yourwebsite.com" style="color: #007bff;">Visit Trendify</a></p>
                    <br>
                    <p>Best regards,<br><strong>Trendify Team</strong></p>
                </div>
            `,
        };
        
        await transporter.sendMail(mailOption);

        return res.status(201).json({ 
            success: true, 
            message: 'Registered successfully.', 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: 'An error occurred while registering. Please try again later.' 
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(200).json({ 
            success: false, 
            message: 'Email and password are required.' 
        });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(200).json({ 
                success: false, 
                message: 'Invalid email or password.' 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(200).json({ 
                success: false, 
                message: 'Invalid email or password.' 
            });
        }

        user.lastLogged = Date.now();
        await user.save();
        
        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id, user.role);

        // Gửi token trong cookie
        res.cookie('accessToken', accessToken, accessTokenOptions);
        res.cookie('refreshToken', refreshToken, refreshTokenOptions);

        // Gửi token trong response
        return res.status(200).json({ 
            success: true, 
            message: 'Logged in successfully.',
            user: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: 'An error occurred while logging in. Please try again later.' 
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('accessToken', accessTokenOptions);
        res.clearCookie('refreshToken', refreshTokenOptions);
        return res.status(200).json({ 
            success: true, 
            message: 'Logged out successfully.' 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: 'An error occurred while logging out. Please try again later.' 
        });
    }
};

export const sendVerifyOtp = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required.',
        });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        if (user.isAccountVerified) {
            return res.status(409).json({
                success: false,
                message: 'Account is already verified.',
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; //24 giờ 
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Trendify Account Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;">
                    <h2 style="color: #007bff;">Trendify Account Verification</h2>
                    <p style="font-size: 18px;">Your OTP is:</p>
                    <p style="font-size: 24px; font-weight: bold; color: #ff5733;">${otp}</p>
                    <p style="font-size: 16px;">This OTP will expire in <strong>24 hours</strong>.</p>
                    <br>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>Best regards,<br><strong>Trendify Team</strong></p>
                </div>
            `,
        };        

        await transporter.sendMail(mailOption);

        return res.status(201).json({
            success: true,
            message: 'Verification OTP has been sent to your email.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send verification OTP. Please try again later.',
        });
    }
};

export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({
            success: false,
            message: 'User ID and OTP are required.',
        });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        if (user.isAccountVerified) {
            return res.status(409).json({
                success: false,
                message: 'Account is already verified.',
            });
        }

        if (user.verifyOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP.',
            });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            user.verifyOtp = ''; 
            user.verifyOtpExpireAt = 0;
            await user.save();

            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one.',
            });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Welcome to Trendify - Verification Complete',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;">
                    <h2>Welcome to Trendify, ${user.name}!</h2>
                    <p>Your email has been successfully verified. We're excited to have you on board.</p>
                    <p>Start exploring now: <a href="https://yourwebsite.com">Trendify</a></p>
                    <br>
                    <p>Best regards,<br><strong>Trendify Team</strong></p>
                </div>
            `,
        };
        await transporter.sendMail(mailOption);

        return res.status(200).json({
            success: true,
            message: 'Email has been verified successfully.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during email verification. Please try again.',
        });
    }
};

export const isAuthenticated = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'User is authenticated.'
        });
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
};

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required.'
        });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString().padStart(6, '0');

        user.restOtp = otp;
        user.restOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 phút
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Trendify Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;">
                    <h2 style="color: #007bff;">Trendify Password Reset</h2>
                    <p style="font-size: 18px;">Your OTP is:</p>
                    <p style="font-size: 24px; font-weight: bold; color: #ff5733;">${otp}</p>
                    <p style="font-size: 16px;">This OTP will expire in <strong>15 minutes</strong>.</p>
                    <br>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>Best regards,<br><strong>Trendify Team</strong></p>
                </div>
            `,
        };

        await transporter.sendMail(mailOption);
        return res.status(201).json({
            success: true,
            message: 'Password reset OTP has been sent to your email.'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while sending the OTP. Please try again later.'
        });
    }
};

export const matchResetOTP = async (req, res) => {
    const {email, otp} = req.body;
    if(!otp){
        return res.status(400).json({
            success: false,
            message: 'OTP is required.'
        });
    }
    try {
        const user = await userModel.findOne({email})
        if (user.restOtp !== otp) {
            return res.status(404).json({
                success: false,
                message: 'Invalid OTP.'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'OTP is valid.'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
};

export const resetPassword = async (req, res) => {
    const { email, otp, newpassword } = req.body;

    if (!email || !otp || !newpassword) {
        return res.status(400).json({
            success: false,
            message: 'Email, OTP, and new password are required.',
        });
    }

    try {
        const user = await userModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        if (!user.restOtp || user.restOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP.',
            });
        }

        if (!user.restOtpExpireAt || user.restOtpExpireAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired.',
            });
        }

        const hashedPassword = await bcrypt.hash(newpassword, 10);
        user.password = hashedPassword;

        user.restOtp = '';
        user.restOtpExpireAt = 0;
        await user.save();
        
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Trendify - Password Reset Successful',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;">
                    <h2 style="color: #007bff;">Password Reset Successful</h2>
                    <p style="font-size: 16px;">Your password has been changed successfully.</p>
                    <p>If you did not perform this action, please contact our support team immediately.</p>
                    <br>
                    <p>Best regards,<br><strong>Trendify Team</strong></p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: 'Password has been reset successfully.',
        });

    } catch (error) {
        console.error('Error in resetPassword:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while resetting the password. Please try again later.',
        });
    }
};
