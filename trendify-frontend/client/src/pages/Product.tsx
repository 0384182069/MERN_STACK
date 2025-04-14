import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  category: Category;
  subCategory: string;
  bestSeller: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  product: Product;
}

const Product = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const { Backend_API } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<ApiResponse>(`${Backend_API}/api/product/${id}`);
        if (response.data.success) {
          setProduct(response.data.product);
        } else {
          throw new Error(response.data.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, Backend_API]);

  const handleAddToCart = async () => {
    axios.defaults.withCredentials = true;
    if (!selectedSize) {
      toast.error('Please select size');
      return;
    }
    const response = await axios.post(`${Backend_API}/api/cart`, {  
      id: id,
      size: selectedSize,
    },
  );
    if (response.data.success) {
      toast.success('Added to cart');
    } else {
      toast.error(response.data.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 mt-10">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-4 mt-10">
        <div className="text-red-500 text-center">
          <p className="text-lg font-medium mb-2">{error || 'Product not found'}</p>
          <Button 
            onClick={() => window.history.back()} 
            className="mt-4"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 ">
      <Button 
        onClick={() => navigate(-1)} 
        variant="ghost" 
        className="mb-4 flex items-center gap-2 hover:bg-gray-100"
      >
        <ArrowLeft size={20} />
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Image Gallery */}
        <div className="space-y-2 max-w-md mx-auto">
          <div className="aspect-square relative overflow-hidden rounded-lg h-[400px]">
            <motion.img
              key={selectedImage}
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="grid grid-cols-6 gap-1">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-lg border h-[60px] ${
                  selectedImage === index ? 'border-black' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-medium mb-1">{product.name}</h1>
            <p className="text-xl font-medium">${product.price}</p>
          </div>

          <div>
            <h2 className="text-base font-medium mb-1">Description</h2>
            <p className="text-sm text-gray-600">{product.description}</p>
          </div>

          <div>
            <h2 className="text-base font-medium mb-1">Size</h2>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 border rounded-md text-sm ${
                    selectedSize === size
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-base font-medium mb-1">Information</h2>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Category: {product.category.name}</p>
              <p>Sub Category: {product.subCategory}</p>
              {product.bestSeller && (
                <p className="text-red-500">Best Seller</p>
              )}
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full py-4 text-base"
          >
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Product;
