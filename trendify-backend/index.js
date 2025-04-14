import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectMGDB from "./config/mongodb.js";
import authRouter from './routes/auth.route.js'
import userRouter from "./routes/user.route.js";
import connectCloudinary from "./config/cloudinary.js";
import productRouter from "./routes/product.route.js";
import categoryRouter from "./routes/category.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = process.env.PORT || 4000;
const allowOrigins = ["http://localhost:5173", "http://localhost:5174"];
connectMGDB();
connectCloudinary();


app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowOrigins,credentials: true}));

app.get('/',(req, res) => res.send("API"));
app.use('/api/auth', authRouter); 
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/order', orderRouter);
app.use('/api/cart', cartRouter);


app.listen(port, ()=> console.log(`Server started on PORT: http://localhost:${port}`));