import { Router } from "express";
import { placeOrderCod, placeOrderStripe, getUserOrders, getOrderDetails, updateOrderStatus, processRefund, handleStripeWebhook } from "../controllers/order.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const orderRouter = Router();

orderRouter.post("/place-cod", authMiddleware, roleMiddleware(["user"]), placeOrderCod);
orderRouter.post("/place-stripe", authMiddleware, roleMiddleware(["user"]), placeOrderStripe);
orderRouter.get("/user", authMiddleware, roleMiddleware(["user"]), getUserOrders);
orderRouter.get("/:id", authMiddleware, roleMiddleware(["user"]), getOrderDetails);
orderRouter.put("/status/:id", authMiddleware, roleMiddleware(["admin"]), updateOrderStatus);
orderRouter.post("/refund/:id", authMiddleware, roleMiddleware(["user"]), processRefund);
orderRouter.post("/webhook", handleStripeWebhook);

export default orderRouter;

