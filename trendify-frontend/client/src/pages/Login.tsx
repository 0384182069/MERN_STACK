import { imgs } from "@/assets/constants";
import { useState } from "react"
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { toast } from "react-toastify";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/InputProps";



const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {Backend_API, setIsLoggedIn,} = useAuth();

  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    const endpoint = "/api/auth/login";
    const body = {email: trimmedEmail,password: trimmedPassword};
    try {
      const {data} = await axios.post( `${Backend_API}${endpoint}`, body);
      if(data.success){
        if(data.user.isAccountVerified){
          setIsLoggedIn(true);
          toast.success(data.message,{ autoClose: 1000 });
        }
        else{
          setIsLoggedIn(false);
          navigate('/email-verify');
        }
      }
      else{
        toast.error(data.message,{ autoClose: 1000 });
        setIsLoggedIn(false);
      }
    } catch (error) {
      toast.error("Somethings were wrong!", {autoClose: 1000});
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] sm:px-0">
      <div className="border border-gray-300 py-4 px-10 rounded-lg shadow-2xl w-full sm:w-96 text-sm ">
        <div className="flex justify-center">
          <img src={imgs.logo} alt="logo" className="w-28 h-auto" />
        </div>
        <h2 className="text-xl font-semibold text-center mb-2">Sign in to Trendify</h2>
        <p className="text-sm mb-6 text-center">Wellcomback!, Please sign in to continue.</p>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
              <Input
              label="Email address"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              />
          </div>

          <div className="mb-4">
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              />
          </div>
          
          <p onClick={() => navigate("/reset-password")} className="mb-4 cursor-pointer text-blue-400 hover:underline">Forgot password?</p>
          <Button className="w-full py-2.5 font-medium rounded-full bg-gradient-to-r from-webprimary to-websecondary hover:opacity-80 transition duration-200">Sign In</Button>
        </form>
        
        <p className="text-gray-400 text-center text-xs mt-4">
          Dont't have an account?
          <span onClick = {() => navigate("/register")} className="text-blue-400 cursor-pointer hover:underline">Sign up</span>
        </p>
        <hr className="mt-4 border-gray-300" />
        <p className="text-center text-xs text-gray-400 mt-4">Secured by Trendify</p>
      </div>
    </div>
  )
}

export default Login
