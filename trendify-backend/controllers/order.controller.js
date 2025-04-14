import orderModel from "../models/order.model.js";
import cartModel from "../models/cart.model.js";
import Stripe from 'stripe';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Hàm helper để validate input
const validateOrderInput = (userId, shippingInfo) => {
    const errors = [];
    if (!userId) errors.push("userId is required");
    if (!shippingInfo) errors.push("shipping information is required");
    if (!shippingInfo.name) errors.push("shipping name is required");
    if (!shippingInfo.phone) errors.push("shipping phone is required");
    if (!shippingInfo.address) errors.push("shipping address is required");
    if (!shippingInfo.district) errors.push("shipping district is required");
    if (!shippingInfo.city) errors.push("shipping city is required");
    return errors;
};

// Hàm helper để kiểm tra giỏ hàng
const validateCart = async (userId) => {
    const cart = await cartModel.findOne({ userId })
        .populate('items.productId');

    if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
    }
    return cart;
};

// Đặt hàng COD
export const placeOrderCod = async (req, res) => {
    try {
        const { userId, shippingInfo } = req.body;

        // Validate input
        const validationErrors = validateOrderInput(userId, shippingInfo);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }

        // Kiểm tra giỏ hàng
        const cart = await cartModel.findOne({ userId })
            .populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // Tạo đơn hàng mới
        const newOrder = new orderModel({
            userId,
            items: cart.items,
            total: cart.total,
            shippingInfo,
            paymentMethod: 'cod',
            status: 'pending',
            paymentStatus: 'pending'
        });

        await newOrder.save();
        await cartModel.findOneAndDelete({ userId });

        return res.status(200).json({
            success: true,
            message: "Order placed successfully",
            order: newOrder
        });

    } catch (error) {
        console.error('Error placing COD order:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// Đặt hàng Stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, shippingInfo, paymentMethodId } = req.body;

        // Validate input
        const validationErrors = validateOrderInput(userId, shippingInfo);
        if (!paymentMethodId) validationErrors.push("Payment method ID is required");
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }

        // Kiểm tra và lấy giỏ hàng
        const cart = await validateCart(userId);

        // Tạo payment intent với Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(cart.total * 100),
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
            metadata: {
                userId,
                cartId: cart._id.toString(),
                orderType: 'stripe'
            }
        });

        // Tạo đơn hàng mới
        const newOrder = new orderModel({
            userId,
            items: cart.items,
            total: cart.total,
            shippingInfo,
            paymentMethod: 'stripe',
            status: 'processing',
            paymentStatus: 'processing',
            stripePaymentIntentId: paymentIntent.id,
            paymentDetails: {
                last4: paymentIntent.payment_method_details.card.last4,
                brand: paymentIntent.payment_method_details.card.brand,
                expMonth: paymentIntent.payment_method_details.card.exp_month,
                expYear: paymentIntent.payment_method_details.card.exp_year
            }
        });

        // Lưu đơn hàng và xóa giỏ hàng trong transaction
        const session = await orderModel.startSession();
        try {
            session.startTransaction();
            await newOrder.save({ session });
            await cartModel.findOneAndDelete({ userId }, { session });
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

        return res.status(200).json({
            success: true,
            message: "Payment successful and order placed",
            order: newOrder
        });

    } catch (error) {
        console.error('Error processing Stripe payment:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Payment processing failed"
        });
    }
};

// Lấy danh sách đơn hàng của user
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        // Validate userId
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId is required"
            });
        }

        // Kiểm tra format của userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid userId format"
            });
        }

        const orders = await orderModel.find({ userId })
            .sort({ createdAt: -1 });

        // Thêm thông tin về số lượng đơn hàng
        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
            message: orders.length > 0 
                ? `Found ${orders.length} orders` 
                : "No orders found for this user"
        });

    } catch (error) {
        console.error('Error fetching user orders:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Lấy chi tiết đơn hàng
export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Error fetching order details:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        await order.updateStatus(status);

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Xử lý hoàn tiền
export const processRefund = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { amount, reason } = req.body;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.paymentMethod === 'stripe') {
            // Xử lý hoàn tiền qua Stripe
            const refund = await stripe.refunds.create({
                payment_intent: order.stripePaymentIntentId,
                amount: Math.round(amount * 100)
            });

            await order.processRefund(amount, reason);
        } else {
            await order.processRefund(amount, reason);
        }

        return res.status(200).json({
            success: true,
            message: "Refund processed successfully",
            order
        });
    } catch (error) {
        console.error('Error processing refund:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Webhook handler cho Stripe
export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = 'your_webhook_secret';

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                await orderModel.findOneAndUpdate(
                    { stripePaymentIntentId: paymentIntent.id },
                    { 
                        status: 'confirmed',
                        paymentStatus: 'paid'
                    }
                );
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                await orderModel.findOneAndUpdate(
                    { stripePaymentIntentId: failedPayment.id },
                    { 
                        status: 'cancelled',
                        paymentStatus: 'failed'
                    }
                );
                break;
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Webhook Error:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

