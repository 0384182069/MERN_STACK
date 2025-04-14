import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {Backend_API,setIsLoggedIn,} = useAuth();
  
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  const handleLogin = async (e:React.FormEvent)=>{
    e.preventDefault();
    axios.defaults.withCredentials = true;
    const endpoint = "/api/auth/login";
    const body = {email: trimmedEmail,password: trimmedPassword};
    try {
      const {data} = await axios.post( `${Backend_API}${endpoint}`, body);
      if(data.success){
        setIsLoggedIn(true);
        toast.success(data.message);
        navigate('/dashboard');
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error logging in");
    }
  }
  return (
    <div className="h-[100vh] flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">Login</CardTitle>
          <CardDescription className="text-l text-center text-gray-500">Welcom to trendify admin</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="px-4" onSubmit={handleLogin}>
            <div className="mb-4">
              <Input 
                type="email" 
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="rounded-xl"/>
            </div>
            <div className="mb-6">
              <Input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="rounded-xl"/>
            </div>
            <div className="flex items-center justify-center mb-4">
              <Button className="w-full rounded-xl">Sign in</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
