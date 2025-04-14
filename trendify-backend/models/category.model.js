import mongoose, { Schema, Types } from "mongoose";

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true }, 
},{ timestamps: true });

const categoryModel = mongoose.models.category || mongoose.model('category', categorySchema);

export default categoryModel;
