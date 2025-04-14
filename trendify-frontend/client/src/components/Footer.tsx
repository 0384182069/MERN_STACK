import { imgs } from '@/assets/constants'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
      <div className='flex justify-between mx-16 sm:grid-cols-[3fr_1fr_1fr] gap-1 my-14 text-sm'>

        <div>
            <Link to={'/'}>
                <img src={imgs.logo} alt="logo" className="w-28 h-auto cursor-pointer" />
            </Link>
            <p className='w-full md:w-2/3 text-gray-600'>
                Trendify - Awaken your senses with every fragrance. We bring you elegant and refined perfumes to help you shine with confidence every day.
            </p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Home</li>
                <li>Collection</li>
                <li>About</li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+84 90-123-4567</li>
                <li>trendifystudio@gmail.com</li>
            </ul>
        </div>
      </div>
      <div>
            <hr/>
            <p className='py-5 text-sm text-center'>Copyright 2025@ trendify.com - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer
