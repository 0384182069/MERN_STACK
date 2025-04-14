import { AuthRoutes, ProtectedRoutes } from '@/components/guards/ProtectedRoutes'
import About from '@/pages/About'
import Cart from '@/pages/Cart'
import Collection from '@/pages/Collection'
import EmailVerify from '@/pages/EmailVerify'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Order from '@/pages/Order'
import PlaceOrder from '@/pages/PlaceOrder'
import Product from '@/pages/Product'
import Register from '@/pages/Register'
import ResetPassword from '@/pages/ResetPassword'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/collection/" element={<Collection/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/product/:id" element={<Product/>}/>
        <Route element={<AuthRoutes/>}>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>}/>
            <Route path="/email-verify" element={<EmailVerify/>} />
            <Route path="/reset-password" element={<ResetPassword/>} />
        </Route>
        <Route element={<ProtectedRoutes/>}>
            <Route path="/cart" element={<Cart/>}></Route>
            <Route path="/order" element={<Order/>}></Route>
            <Route path="/place-order" element={<PlaceOrder/>}></Route>
        </Route>        
    </Routes>
  )
}

export default AppRoutes
