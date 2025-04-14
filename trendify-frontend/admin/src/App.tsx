import { Navigate, Route, Routes, Outlet } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Category from "./pages/Category"
import Product from "./pages/Product"
import { ToastContainer } from "react-toastify"
import Order from "./pages/Order"
import { AuthRoutes, ProtectedRoutes } from "./components/gaurds/ProtectedRoute"
import Layout from "./pages/Layout"
import User from "./pages/User"

const App = () => {
  return (
    <>
      <ToastContainer/>
      <Routes>
        <Route element={<AuthRoutes/>}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoutes/>}>
          <Route element={<Layout><Outlet/></Layout>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard/>}/> 
            <Route path="category" element={<Category/>}/>
            <Route path="product" element={<Product/>} />
            <Route path="order" element={<Order/>}/>
            <Route path="user" element={<User/>}/>
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
