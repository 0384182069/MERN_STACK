import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Input from '@/components/InputProps';

interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
  district: string;
  city: string;
}

interface CartItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  size: string;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  total: number;
}

const PlaceOrder = () => {
  const { Backend_API, userData } = useAuth();
  const { updateCartCount } = useCart();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    phone: '',
    address: '',
    district: '',
    city: ''
  });

  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'stripe'>('cod');

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `${Backend_API}/api/cart/`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setCart(response.data.cart);
        }
      } catch (error) {
        toast.error('Không thể tải thông tin giỏ hàng');
      }
    };

    fetchCart();
  }, [Backend_API, userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${Backend_API}/api/order/${paymentMethod}`,
        {
          userId: userData?._id,
          shippingInfo
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Đặt hàng thành công!');
        await updateCartCount();
        navigate('/order');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.errors?.join(', ') || 
                          error.response?.data?.message || 
                          'Có lỗi xảy ra khi đặt hàng';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-xl font-semibold mb-4">Thanh toán</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cột trái - Thông tin giao hàng */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Thông tin giao hàng</h2>
          <form className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Tên người nhận"
                type="text"
                value={shippingInfo.name}
                onChange={handleInputChange}
                placeholder="Nhập tên người nhận"
                required
              />

              <Input
                label="Số điện thoại"
                type="tel"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>

            <Input
              label="Địa chỉ"
              type="text"
              value={shippingInfo.address}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ cụ thể"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Quận/Huyện"
                type="text"
                value={shippingInfo.district}
                onChange={handleInputChange}
                placeholder="Nhập quận/huyện"
                required
              />

              <Input
                label="Thành phố"
                type="text"
                value={shippingInfo.city}
                onChange={handleInputChange}
                placeholder="Nhập thành phố"
                required
              />
            </div>
          </form>
        </div>

        {/* Cột phải - Thông tin đơn hàng */}
        <div className="space-y-4">
          {/* Danh sách sản phẩm */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Đơn hàng của bạn</h2>
            <div className="max-h-[300px] overflow-y-auto space-y-3">
              {cart?.items.map((item) => (
                <div key={`${item.productId._id}-${item.size}`} className="flex items-center space-x-3 py-2 border-b">
                  <img 
                    src={item.productId.images[0]} 
                    alt={item.productId.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.productId.name}</h3>
                    <p className="text-xs text-gray-600">Size: {item.size}</p>
                    <p className="text-xs text-gray-600">Số lượng: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-sm">${item.productId.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Phương thức thanh toán và tổng tiền */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Phương thức thanh toán</h2>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                  className="w-4 h-4"
                />
                <label htmlFor="cod" className="text-sm">Thanh toán khi nhận hàng (COD)</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="stripe"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'stripe')}
                  className="w-4 h-4"
                />
                <label htmlFor="stripe" className="text-sm">Thanh toán bằng thẻ (Stripe)</label>
              </div>
            </div>

            {/* Tổng tiền */}
            <div className="mt-4 pt-3 border-t">
              <div className="flex justify-between text-sm mb-1">
                <span>Tạm tính:</span>
                <span>${cart?.total || 0}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Phí vận chuyển:</span>
                <span>$0</span>
              </div>
              <div className="flex justify-between font-semibold text-base mt-2 pt-2 border-t">
                <span>Tổng cộng:</span>
                <span>${cart?.total || 0}</span>
              </div>
            </div>

            {/* Nút đặt hàng */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !cart?.items.length}
              className={`w-full mt-4 bg-black text-white py-2.5 rounded-md hover:bg-gray-800 transition-colors text-sm
                ${(isLoading || !cart?.items.length) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
