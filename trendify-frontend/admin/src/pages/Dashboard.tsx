import { Users,DollarSign, Package } from 'lucide-react'
import React from 'react'
import { RevenueChart } from '@/components/RevenueChart'
import MyCard from '@/components/MyCard'


const Dashboard = () => {
  return (
    <>
      <div className='flex justify-between space-x-2 my-4'>
        <MyCard 
          title="Total Product"
          content="$45,231.89"
          icon={<Package size={20} />}
        />
        <MyCard 
          title="Total User"
          content="$45,231.89"
          icon={<Users size={20} />}
        />
        <MyCard 
          title="Total Revenue"
          content="$45,231.89"
          icon={<DollarSign size={20} />}
        />
      </div>
      <div>
       <RevenueChart/>
      </div>
    </>
  )
}

export default Dashboard
