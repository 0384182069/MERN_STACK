import { useState } from 'react';
import { imgs, navItems } from '../assets/constants';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ChevronsRight, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CircleUserRound, ShoppingBasket, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const {userData, Backend_API, setIsLoggedIn, setUserData,} = useAuth();
    const { cartItemsCount } = useCart();
    const location = useLocation(); 
    const navigate = useNavigate();

    const toggleNavbar = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    };

    const handleLogout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const endpoint = "/api/auth/logout";
            
            const { data } = await axios.post(`${Backend_API}${endpoint}`);
            
            if (data?.success) {
                setIsLoggedIn(false);
                setUserData(null); 
                toast.success(data.message,{autoClose: 1000});
                navigate('/');
            }
    
        } catch (error) {
            console.error("Logout error:", error);
            toast.error('Somethings went wrong!',{autoClose: 1000});
        }
    };
    

    return (
        <nav className="sticky top-0 z-50 py-2 backdrop-blur-lg border-b border-neutral-700/80">
            <div className="container px-5 mx-auto relative text-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center flex-shrink-0">
                        <Link to={'/'}>
                            <img src={imgs.logo} alt="logo" className="w-28 h-auto cursor-pointer" />
                        </Link>
                    </div>
                    <ul className="hidden lg:flex flex-2 space-x-12 text-base relative">
                        {navItems.map((item, index) => (
                            <li key={index} className="relative pb-2">
                                <Link
                                    className={`transition duration-300 ${
                                        location.pathname === item.href
                                            ? 'text-webprimary'
                                            : 'text-black hover:text-webprimary'
                                    }`}
                                    to={item.href}
                                >
                                    {item.label}
                                </Link>
                                {location.pathname === item.href && (
                                    <motion.div
                                        layoutId="underline"
                                        className="absolute bottom-0 left-0 w-full h-[3px] bg-webprimary rounded-lg"
                                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="hidden lg:flex justify-center items-center space-x-12">
                        {userData ?
                        <div className='flex space-x-4'>
                            <div className='cursor-pointer'>
                                <Search size={25} strokeWidth={1}/>
                            </div>
                            <div className='cursor-pointer relative group'>
                                <CircleUserRound size={25} strokeWidth={1}/>
                                <div className='absolute hidden group-hover:block top-0 right-0 w-28 z-10 text-black pt-10 rounded-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out'>
                                <ul className="py-3 bg-gray-200 rounded-lg text-sm text-gray-700">
                                        <li className="px-4 py-2 hover:bg-white cursor-pointer transition-colors">Profile</li>
                                        <li className="px-4 py-2 hover:bg-white cursor-pointer transition-colors">Settings</li>
                                        <li onClick={handleLogout} className="px-4 py-2 hover:bg-red-200 text-red-500 cursor-pointer transition-colors">Logout</li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <Link to={'/cart'} className='relative cursor-pointer'>
                                    <ShoppingBasket size={25} strokeWidth={1}/>
                                    {cartItemsCount > 0 && (
                                        <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[10px]'>
                                            {cartItemsCount}
                                        </p>
                                    )}
                                </Link>
                            </div>
                         </div>
                            :
                            <Button onClick={()=>navigate(`/login?returnUrl=${encodeURIComponent(location.pathname)}`)} className="relative px-3 py-2 rounded-full bg-black text-white overflow-hidden transition-all duration-700 before:absolute before:inset-0 before:bg-gradient-to-r before:from-webprimary before:to-websecondary before:translate-x-[-100%] before:transition-all before:duration-700 hover:before:translate-x-0">
                                <span className="relative z-10">Sign In</span>
                                <ChevronsRight strokeWidth={3} className="relative z-10" />
                            </Button>
                        }
                    </div>
                    <div className="lg:hidden md:flex flex-col justify-end">
                        <Button
                            onClick={toggleNavbar}
                            className="bg-white border border-black text-black hover:bg-webprimary transition duration-300"
                        >
                            {mobileDrawerOpen ? <X /> : <Menu />}
                        </Button>
                    </div>
                </div>
                {mobileDrawerOpen && (
                    <div className="fixed right-0 z-20 bg-gray-600 w-full p-12 flex flex-col justify-center items-center lg:hidden">
                        <ul className="relative">
                            {navItems.map((item, index) => (
                                <li key={index} className="relative py-3 text-base">
                                    <Link
                                        className={`transition duration-300 ${
                                            location.pathname === item.href
                                                ? 'text-webprimary'
                                                : 'text-black hover:text-webprimary'
                                        }`}
                                        to={item.href}
                                        onClick={() => setMobileDrawerOpen(false)} 
                                    >
                                        {item.label}
                                    </Link>
                                    {location.pathname === item.href && (
                                        <motion.div
                                            layoutId="underline"
                                            className="absolute bottom-0 left-0 w-full h-[3px] bg-webprimary rounded-lg"
                                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div className="pt-3">
                            <Button className="relative px-3 py-2 rounded-full bg-black text-white overflow-hidden transition-all duration-700 before:absolute before:inset-0 before:bg-gradient-to-r before:from-webprimary before:to-websecondary before:translate-x-[-100%] before:transition-all before:duration-700 hover:before:translate-x-0">
                                <Link to={'/login'}><span className="relative z-10">Sign In</span></Link>
                                <ChevronsRight strokeWidth={3} className="relative z-10" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
