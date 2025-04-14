import userModel from "../models/user.model.js";

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if(!user){
            return res.status(200).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
                role: user.role,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({
            success: true,
            users: users
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
