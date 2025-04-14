import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, TrashIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCart } from '@/context/CartContext';

interface CartItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  size: string;
  quantity: number;
  total: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
  totalPrice: number;
}

const Cart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { Backend_API } = useAuth();
  const navigate = useNavigate();
  const { updateCartCount } = useCart();

  const fetchCart = async () => {
    axios.defaults.withCredentials = true;
    try {
      setLoading(true);
      const response = await axios.get(`${Backend_API}/api/cart`);
      console.log(response.data.cart);
      setCart(response.data.cart);
    } catch (error) {
      setError('Failed to load cart');
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId: string, size: string, newQuantity: number) => {
    try {
      if (newQuantity < 1) return;

      setLoading(true);
      
      const response = await axios.put(
        `${Backend_API}/api/cart/${productId}/${size}/${newQuantity}`, 
        { withCredentials: true }
      );

      if (response.data.success) {
        setCart(response.data.cart);
        await updateCartCount();
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Error to updating cart', {autoClose: 1000});
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart - không cần userId
  const removeItem = async (productId: string, size: string) => {
    try {
      await axios.delete(`${Backend_API}/api/cart/${productId}/${size}`, {
        withCredentials: true
      });
      
      fetchCart();
      await updateCartCount();
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Error to removing item', {autoClose: 1000});
    }
  };

  // Navigate to checkout
  const handleCheckout = () => {
    navigate('/place-order');
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${Backend_API}/api/cart/`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setCart(response.data.cart);
        toast.success('Cleared cart',{autoClose:1000});
        await updateCartCount();
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Error to clearing cart', {autoClose: 1000});
    } finally {
      setLoading(false);
    }
  };

  

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchCart}>Try again</Button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center mx-auto text-center h-[80vh]">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/collection')}>
          Continue shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header với title và nút Clear */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Your Cart</h1>
        
        {cart?.items.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
            onClick={clearCart}
            disabled={loading}
          >
            <TrashIcon className="h-4 w-4" />
            Delete all
          </Button>
        )}
      </div>

      {/* Cart Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <motion.div
              key={`${item.productId._id}-${item.size}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-4 p-4 border rounded-lg"
            >
              {/* Product Image */}
              <img
                src={item.productId.images[0]}
                alt={item.productId.name}
                className="w-24 h-24 object-cover rounded"
              />

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="font-medium">{item.productId.name}</h3>
                <p className="text-gray-600">Size: {item.size}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(
                    item.productId._id,
                    item.size,
                    item.quantity - 1
                  )}
                  disabled={loading || item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <span className="w-8 text-center">
                  {item.quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(
                    item.productId._id,
                    item.size,
                    item.quantity + 1
                  )}
                  disabled={loading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-medium">${item.total}</p>
              </div>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.productId._id, item.size)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cart.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping fee</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${cart.totalPrice}</span>
                </div>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
