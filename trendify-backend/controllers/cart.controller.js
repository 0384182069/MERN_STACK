import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
    try {
        const { id, size, quantity = 1 } = req.body;
        const { userId } = req.body;

        // Kiểm tra sản phẩm có tồn tại không
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Tìm giỏ hàng của user
        let cart = await cartModel.findOne({ userId });

        if (cart) {
            // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
            const existingItem = cart.items.find(
                item => item.productId.toString() === id && item.size === size
            );

            if (existingItem) {
                // Nếu có rồi thì tăng số lượng
                existingItem.quantity += quantity;
            } else {
                // Nếu chưa có thì thêm mới
                cart.items.push({ productId: id, size, quantity });
            }
        } else {
            // Nếu chưa có giỏ hàng thì tạo mới
            cart = new cartModel({
                userId,
                items: [{ productId: id, size, quantity }]
            });
        }

        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Added to cart successfully',
            cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error when adding to cart',
            error: error.message
        });
    }
};

// Lấy thông tin giỏ hàng
export const getCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const cart = await cartModel.findOne({ userId })
            .populate('items.productId', 'name price images');

        if (!cart) {
            return res.status(200).json({
                success: true,
                count: 0,
                cart: { items: [] }
            });
        }
        const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

        res.status(200).json({
            success: true,
            count: totalQuantity, 
            cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error when getting cart information',
            error: error.message
        });
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (req, res) => {
    try {
        const { id, size, quantity } = req.params; 
        const { userId } = req.body;    

        // Validate input
        const newQuantity = parseInt(quantity);
        if (isNaN(newQuantity) || newQuantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid quantity'
            });
        }

        // Tìm giỏ hàng và cập nhật
        const cart = await cartModel.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Tìm item trong giỏ hàng
        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === id && item.size === size
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in cart'
            });
        }

        // Cập nhật số lượng
        cart.items[itemIndex].quantity = newQuantity;

        // Lưu giỏ hàng
        await cart.save();
        await cart.populate('items.productId');

        return res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            cart
        });

    } catch (error) {
        console.error('Error updating cart:', error);
        return res.status(500).json({
            success: false,
            message: 'Error when updating cart',
            error: error.message
        });
    }
};

// Xóa một sản phẩm khỏi giỏ hàng
export const removeCartItem = async (req, res) => {
    try {
        const { id, size } = req.params;    
        const { userId } = req.body;

        const cart = await cartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === id && item.size === size
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in cart'
            });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Product removed from cart',
            cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error when removing product from cart',
            error: error.message
        });
    }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const cart = await cartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'All cart items removed',
            cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error when removing cart',
            error: error.message
        });
    }
}; 

