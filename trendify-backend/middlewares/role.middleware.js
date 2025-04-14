const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const userRole = req.body.userRole;

            if (!userRole) {
                return res.status(403).json({
                    success: false,
                    message: 'User permission not found'
                });
            }

            // Kiểm tra nếu role của user có trong danh sách được phép
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: 'Not have permission to perform this action.'
                });
            }

            // Nếu có quyền thì cho đi tiếp
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi kiểm tra quyền người dùng'
            });
        }
    };
};

export default roleMiddleware; 