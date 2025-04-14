import { Router } from 'express';
import { addToCart, getCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cart.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.put('/:id/:size/:quantity', authMiddleware, updateCartItem);
router.delete('/:id/:size', authMiddleware, removeCartItem);
router.delete('/', authMiddleware, clearCart);

export default router;
