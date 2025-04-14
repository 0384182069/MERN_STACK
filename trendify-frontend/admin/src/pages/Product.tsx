import { useState, useEffect } from 'react'; // Thêm import useState và useEffect
import { ProductDataTable } from '@/components/ProductDataTable'
import { ProductDiablog } from '@/components/ProductDialog'
import { Card } from '@/components/ui/card'
import axios from 'axios'; 

const Product = () => {
  const [products, setProducts] = useState([]); 
  
  const getAllProducts = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get("http://localhost:4000/api/product/")
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
  
  useEffect(() => {
    getAllProducts();
  }, []);
  
  return (
    <>
      <Card>
        <div className='p-6'>
          <div className='flex justify-end'>
            <ProductDiablog refreshData={getAllProducts} />
          </div>
          <ProductDataTable data={products} refreshData={getAllProducts} />
        </div>
      </Card>
    </>
  )
}

export default Product