import Navbar from "./components/Navbar"
import {ToastContainer} from 'react-toastify'
import AppRoutes from "./routes/AppRoutes"
import { Suspense } from "react"
import Loading from "./components/Loading"
import Footer from "./components/Footer"



const App = () => {
  return (
    <>
      <Suspense fallback={<Loading/>}>
        <ToastContainer/>
        <Navbar/>
        <AppRoutes/>
        <Footer/>
      </Suspense>
    </>
    
  )
}

export default App
