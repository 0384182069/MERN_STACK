import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

const accessTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 5 * 60 * 1000, 
};

const authMiddleware = async (req, res, next) => {
    // Lấy token từ cookie hoặc header
    const accessToken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) { 
        // Nếu không có access token
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token. Please login.',
            });
        }

        try {
            // Xác thực refresh token
            const refreshDecoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            
            // Tìm người dùng và xác thực refresh token
            const user = await userModel.findById(refreshDecoded.id);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid authentication token. Please login.',
                });
            }

            // Tạo access token mới
            const newAccessToken = jwt.sign(
                { 
                    id: user._id,
                    role: user.role 
                },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '15m' }
            );

            // Đặt access token mới vào cookie và header
            res.cookie('accessToken', newAccessToken, accessTokenOptions);
            res.setHeader('Authorization', `Bearer ${newAccessToken}`);

            // Đặt user ID và role vào request
            req.body.userId = user._id;
            req.body.userRole = user.role;
            next();
            return;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed. Please login again.',
            });
        }
    }

    try {
        // Xác thực access token
        const tokenDecode = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id;
            req.body.userRole = tokenDecode.role;
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please login again.',
            });
        }

        next();
    } catch (error) {
        // Nếu access token hết hạn
        if (error.name === 'TokenExpiredError') {
            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Access token expired. Please login again.',
                });
            }

            try {
                // Xác thực refresh token
                const refreshDecoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                
                // Tìm người dùng và xác thực refresh token
                const user = await userModel.findById(refreshDecoded.id);
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid authentication token. Please login.',
                    });
                }

                // Tạo access token mới
                const newAccessToken = jwt.sign(
                    { 
                        id: user._id,
                        role: user.role 
                    },
                    process.env.JWT_ACCESS_SECRET,
                    { expiresIn: '15m' }
                );

                // Đặt access token mới vào cookie và header
                res.cookie('accessToken', newAccessToken, accessTokenOptions);
                res.setHeader('Authorization', `Bearer ${newAccessToken}`);

                // Đặt user ID và role vào request
                req.body.userId = user._id;
                req.body.userRole = user.role;
                next();
                return;
            } catch (refreshError) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication failed. Please login again.',
                });
            }
        }

        return res.status(500).json({
            success: false,
            message: 'Authentication failed. Please try again later.',
        });
    }
};

export default authMiddleware;