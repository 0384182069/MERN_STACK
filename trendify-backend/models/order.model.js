import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        size: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    total: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'stripe'],
        default: 'cod'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'processing', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    // Các trường bổ sung cho Stripe
    stripePaymentIntentId: {
        type: String
    },
    stripeCustomerId: {
        type: String
    },
    paymentDetails: {
        last4: String,        // 4 số cuối thẻ
        brand: String,        // Loại thẻ (visa, mastercard...)
        expMonth: Number,     // Tháng hết hạn
        expYear: Number      // Năm hết hạn
    },
    refundInfo: {
        refundId: String,
        amount: Number,
        reason: String,
        date: Date
    },
    shippingInfo: {
        name: String,
        phone: String,
        address: String,
        district: String,
        city: String,
    },
    metadata: {
        type: Map,
        of: String
    }
}, { 
    timestamps: true,

});

// Tự động populate thông tin sản phẩm khi query
orderSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'items.productId',
        select: 'name price images'
    });
    next();
});

// Virtual field để tính tổng số lượng sản phẩm
orderSchema.virtual('totalItems').get(function() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Middleware để cập nhật tổng tiền trước khi lưu
orderSchema.pre('save', async function(next) {
    if (this.isModified('items')) {
        const populatedOrder = await this.populate('items.productId');
        this.total = populatedOrder.items.reduce((total, item) => {
            return total + (item.productId.price * item.quantity);
        }, 0);
    }
    next();
});

// Method để cập nhật trạng thái đơn hàng
orderSchema.methods.updateStatus = async function(newStatus) {
    this.status = newStatus;
    if (newStatus === 'delivered') {
        this.paymentStatus = 'paid';
    }
    return this.save();
};

// Method để xử lý hoàn tiền
orderSchema.methods.processRefund = async function(amount, reason) {
    this.refundInfo = {
        refundId: 'REF_' + Date.now(),
        amount: amount,
        reason: reason,
        date: new Date()
    };
    this.paymentStatus = 'refunded';
    return this.save();
};

// Định nghĩa indexes một lần duy nhất ở cuối file
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ stripePaymentIntentId: 1 }, { sparse: true });

const orderModel = mongoose.model('Order', orderSchema);

export default orderModel;
