import mongoose from "mongoose";

const connectMGDB = async () => {
    
    mongoose.connection.on('connected', () => console.log("Database Connected"));
    await mongoose.connect(`${process.env.MONGODB_URL}/trendify`);
}

export default connectMGDB;