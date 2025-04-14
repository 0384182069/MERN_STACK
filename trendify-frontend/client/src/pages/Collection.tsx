import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'react-toastify';
import { useCart } from '@/context/CartContext';

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
  products: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
}

interface FilterParams {
  page: number;
  limit: number;
  category?: string;
  subCategory?: string;
  sortByPrice?: 'asc' | 'desc' | null;
  bestSeller?: boolean;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const PRODUCTS_PER_PAGE = 5; 

const Collection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    limit: PRODUCTS_PER_PAGE,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const { Backend_API, userData, isLoggedIn } = useAuth();
  const { updateCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchWithRetry = async (params: FilterParams, retryCount = 0): Promise<ApiResponse> => {
    try {
      axios.defaults.withCredentials = true;
      console.log('Actual params being sent:', params);
      const response = await axios.get<ApiResponse>(`${Backend_API}/api/product/`, {
        params,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (err) {
      console.error('Error details:', err);
      
      if (retryCount < MAX_RETRIES) {
        console.log(`Retry attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetry(params, retryCount + 1);
      }
      
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNREFUSED') {
          throw new Error('Unable to connect to the server. Please make sure the server is running.');
        }
        if (err.response) {
          throw new Error(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
        }
        if (err.request) {
          throw new Error('No response received from the server.');
        }
      }
      throw new Error('An error occurred while loading data.');
    }
  };

  const loadProducts = async (newFilters?: Partial<FilterParams>) => {
    try {
      if (newFilters) {
        setIsChanging(true);
      } else {
        setLoading(true);
      }
      setError(null);

      let finalFilters = {
        page: 1,
        limit: PRODUCTS_PER_PAGE
      } as FilterParams;

      if (newFilters?.category) finalFilters.category = newFilters.category;
      if (newFilters?.subCategory) finalFilters.subCategory = newFilters.subCategory;
      if (newFilters?.sortByPrice) finalFilters.sortByPrice = newFilters.sortByPrice;
      if (newFilters?.page) finalFilters.page = newFilters.page;

      console.log('Final filters being sent:', finalFilters);
      
      setFilters(finalFilters);
      const data = await fetchWithRetry(finalFilters);
      
      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
      setIsChanging(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${Backend_API}/api/category`);
        if (response.data.success) {
          setCategories(response.data.categories);

        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [Backend_API]);

  const handlePageChange = (newPage: number) => {
    loadProducts({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    if ('bestSeller' in newFilters && newFilters.bestSeller === undefined) {
      const { bestSeller, ...restFilters } = filters;
      loadProducts({ ...restFilters, ...newFilters, page: 1 });
    } else {
      loadProducts({ ...newFilters, page: 1 });
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (productId: string, size: string) => {
    try {
      if (!isLoggedIn) {
        toast.error('Please login to add to cart',{autoClose: 1000});
        navigate(`/login?returnUrl=${encodeURIComponent(location.pathname)}`);
        return;
      }

      const response = await axios.post(
        `${Backend_API}/api/cart/`,
        {
          id: productId,
          size: size,
          quantity: 1,
          userId: userData._id
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Added to cart',{autoClose: 1000});
        await updateCartCount();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding to cart',{autoClose: 1000});
    }
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(PRODUCTS_PER_PAGE)].map((_, index) => (
          <div key={index} className="aspect-[3/4] bg-gray-200 animate-pulse"></div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-red-500 text-center">
        <p className="text-lg font-medium mb-2">{error}</p>
        <button 
          onClick={() => loadProducts()} 
          className="mt-4 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Section */}
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-end border-b pb-4">
        <Select 
          value={filters.category || 'all'}
          onValueChange={(value) => handleFilterChange({ category: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="CATEGORY" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={filters.subCategory || 'all'}
          onValueChange={(value) => handleFilterChange({ subCategory: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="FILTERS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.sortByPrice || 'newest'}
          onValueChange={(value) => {
            console.log('Selected value:', value);
            
            if (value === 'newest') {
              const cleanFilters = {
                page: 1,
                limit: PRODUCTS_PER_PAGE
              } as {
                page: number;
                limit: number;
                category?: string;
                subCategory?: string;
              };
              
              if (filters.category) cleanFilters.category = filters.category;
              if (filters.subCategory) cleanFilters.subCategory = filters.subCategory;
              
              console.log('Clean filters for newest:', cleanFilters);
              loadProducts(cleanFilters);
            } else {
              const priceFilters = {
                ...filters,
                sortByPrice: value as 'asc' | 'desc',
                page: 1
              };
              
              console.log('Price sort filters:', priceFilters);
              loadProducts(priceFilters);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="SORT BY" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="asc">Price - Low to High</SelectItem>
            <SelectItem value="desc">Price - High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Count with loading indicator */}
      <div className="mb-4 text-gray-600 flex items-center gap-2">
        <span>Hiển thị {products.length} / {totalProducts} sản phẩm</span>
        {isChanging && (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
        )}
      </div>

      {/* Products Grid with animation */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-0.5"
        initial={false}
        animate={{ opacity: isChanging ? 0.6 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {products.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative group bg-[#e7e7e7] hover:bg-white border duration-300 cursor-pointer"
            onClick={() => handleProductClick(product._id)}
          >
            <div className="aspect-[3/4] relative overflow-hidden">
              <img 
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain absolute inset-0 transition-opacity duration-300"
              />
              <img 
                src={product.images[1] || product.images[0]}
                alt={`${product.name} alternate view`}
                className="w-full h-full object-contain absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
              <h3 className="text-sm font-normal text-black mb-2 truncate">
                {product.name}
              </h3>
              <div className="flex items-center justify-between mb-4">
                <p className="text-md text-black">
                  ${product.price}
                </p>
                <p className="text-sm text-gray-700">
                  {product.sizes.join(', ')}
                </p>
              </div>
              <motion.div
                className="flex items-center justify-center cursor-pointer"
                initial="rest"
                whileHover="hover"
                animate="rest"
                onClick={(e) => {
                  e.stopPropagation();
                  if (product.sizes.length > 0) {
                    handleAddToCart(product._id, product.sizes[0]);
                  } else {
                    toast.error('Sản phẩm này hiện không có size nào');
                  }
                }}
              >
                <div className="relative inline-block">
                  <span className="text-sm text-black">Add to cart</span>
                  <motion.span
                    className="absolute left-0 -bottom-0.5 h-[2px] bg-black"
                    variants={{
                      rest: { width: 0 },
                      hover: { width: '100%' },
                    }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      {/* Pagination with disabled state */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <button
            onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
            disabled={filters.page === 1 || isChanging}
            className={`px-3 py-2 border rounded-lg ${
              filters.page === 1 || isChanging
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            ←
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            
            // Luôn hiển thị trang đầu, trang cuối và các trang xung quanh trang hiện tại
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= filters.page - 1 && pageNumber <= filters.page + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-4 py-2 border ${
                    filters.page === pageNumber
                      ? 'bg-black text-white rounded-lg'
                      : 'border-gray-300 hover:bg-gray-100 rounded-lg'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            }

            // Hiển thị dấu ... nếu có khoảng cách
            if (
              pageNumber === filters.page - 2 ||
              pageNumber === filters.page + 2
            ) {
              return <span key={pageNumber} className="px-2">...</span>;
            }

            return null;
          })}

          <button
            onClick={() => handlePageChange(Math.min(totalPages, filters.page + 1))}
            disabled={filters.page === totalPages || isChanging}
            className={`px-3 py-2 border rounded-lg ${
              filters.page === totalPages || isChanging
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}

export default Collection
