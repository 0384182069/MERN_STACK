import mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    sizes: {type: [String], required: true},
    category: { type: Types.ObjectId, ref: 'category', required: true }, 
    subCategory: { type: String, required: true },
    bestSeller: { type: Boolean, required: false, default: false },
},{timestamps: true });

productSchema.plugin(mongoosePaginate);
const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;
