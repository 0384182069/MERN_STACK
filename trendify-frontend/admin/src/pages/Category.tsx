import { CategoryDialog } from '@/components/CategoryDialog';
import { CategoryTable } from '@/components/CategoryTable'
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useEffect, useState } from 'react'

const Category = () => {
  const [categories, setCategories] = useState([]);
  const {Backend_API} = useAuth();
  const getAllCategories = async () => {
    const response = await axios.get(`${Backend_API}/api/category`);
    setCategories(response.data);
  }
  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <>
      <Card>
        <div className='p-6'>
          <div className='flex justify-end'>
            <CategoryDialog refreshData={getAllCategories} />
          </div>
          <CategoryTable data={categories} refreshData={getAllCategories} />
        </div>
      </Card>
    </>
  )
}

export default Category
