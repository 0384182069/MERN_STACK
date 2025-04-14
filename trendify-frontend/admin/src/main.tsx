import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import Layout from './pages/Layout.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import Login from './pages/Login.tsx'


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <App/>
    </AuthProvider>
  </BrowserRouter>
)
