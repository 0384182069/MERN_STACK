import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true},
    role: {type: String, enum: ["user", "admin"], default: "user"},
    cart: {type: mongoose.Schema.Types.ObjectId, ref: "cart"},      
    verifyOtp : {type: String, default: ''},
    verifyOtpExpireAt : {type: Number, default: 0},
    isAccountVerified : {type: Boolean, default: false},
    restOtp : {type: String, default: ''},
    restOtpExpireAt : {type: Number, default: 0},
    lastLogged: {type: Date, default: Date.now },
},{ timestamps: true });

const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel;