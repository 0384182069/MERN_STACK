import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    size: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    total: {  // Total của mỗi item = quantity * price
        type: Number,
        default: 0
    }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    totalPrice: {  // Đổi tên từ totalCart thành totalPrice cho rõ nghĩa
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Middleware để tính total cho mỗi item trước khi lưu
cartSchema.pre('save', async function(next) {
    if (this.isModified('items')) {
        // Populate thông tin sản phẩm để lấy giá
        const populatedCart = await this.populate('items.productId', 'price');
        
        // Tính total cho từng item
        this.items.forEach(item => {
            item.total = item.quantity * item.productId.price;
        });

        // Tính totalPrice của cả giỏ hàng
        this.totalPrice = this.items.reduce((sum, item) => sum + item.total, 0);
    }
    next();
});

// Virtual để lấy tổng số lượng sản phẩm trong giỏ
cartSchema.virtual('totalItems').get(function() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Đảm bảo virtuals được include khi chuyển đổi sang JSON
cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

const cartModel = mongoose.models.cart || mongoose.model("cart", cartSchema);

export default cartModel;
