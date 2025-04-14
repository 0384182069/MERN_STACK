import { imgs } from "@/assets/constants";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import Input from "@/components/InputProps";


const Register = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const {Backend_API} = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    
    const endpoint = "/api/auth/register";
  
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirm.trim();
  
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    if (!passwordRegex.test(trimmedPassword)) {
      return toast.error(
        "Password must meet the following requirements:\n" +
        "- At least 8 characters long\n" +
        "- Contain at least one letter (A-Z, a-z)\n" +
        "- Contain at least one number (0-9)\n" +
        "- Contain at least one special character (@, $, !, %, *, ?, &)\n" +
        "- No spaces allowed"
      );
    }
    
  
    if (trimmedPassword !== trimmedConfirm) {
      return toast.error("Passwords do not match. Please try again.");
    }
  
    const body = { name: trimmedName, email: trimmedEmail, password: trimmedPassword };
  
    try {
      const { data } = await axios.post(`${Backend_API}${endpoint}`, body);
      if (data.success) {
        toast.success(data.message, {autoClose: 1000});
        navigate("/login");
      } else {
        toast.error(data.message, {autoClose: 1000});
      }
    } catch (error) {
        toast.error("Something went wrong!", {autoClose: 1000});
    }
  };

  
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-6 sm:px-0">
      <div className="border border-gray-300 py-4 px-10 rounded-lg shadow-2xl w-full sm:w-96 text-sm">
        <div className="flex justify-center">
          <img src={imgs.logo} alt="logo" className="w-28 h-auto" />
        </div>
        <h2 className="text-xl font-semibold text-center mb-2">Create your account</h2>
        <p className="text-center text-sm mb-6">Welcome! Please fill in the details to get started.</p>
        
        <form onSubmit={handleRegister}>
          {step === 1 ? (
            <>
              <div className="mb-4">
                <Input
                label="User name"
                type="text"
                placeholder="Enter your user name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />
              </div>
              <div className="mb-8">
                <Input
                  label="Email address"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <Input
                label="Confirm passowrd"
                type="password"
                placeholder="Confirm your password"
                value={confirm}
                onChange={(e)=>setConfirm(e.target.value)}
                />
              </div>
            </>
          )}
            <div className="flex justify-center items-center flex-col">
                {step === 2 ? (
                    <>
                    <span className="cursor-pointer">
                        <ChevronLeft size={18} onClick={() => setStep(1)} />
                    </span>
                    <Button
                        onClick={()=>handleRegister}
                        className="w-full py-2.5 font-medium rounded-full bg-gradient-to-r from-webprimary to-websecondary mt-2 hover:opacity-80 transition duration-200"
                    >
                        Sign Up
                    </Button>
                    </>
                ) : (
                    <Button
                    type="button"
                    onClick={() => {
                      if(!name && !email){
                        toast.error("Please enter your user name and email address.");
                        return
                      }
                      if(!name){
                        toast.error("Please enter your user name.");
                        return
                      }
                      if(!email){
                        toast.error("Please enter your email address.");
                        return
                      }
                      setStep(2);
                    }}
                    
                    className="w-full py-2.5 font-medium rounded-full bg-gradient-to-r from-webprimary to-websecondary hover:opacity-80 transition duration-200"
                    >
                    Continue
                    </Button>
                )}
            </div>

        </form>
        
        <p className="text-gray-400 text-center text-xs mt-4">
          Already have an account?
          <span onClick={() => navigate("/login")} className="text-blue-400 cursor-pointer hover:underline"> Sign In</span>
        </p>
        <hr className="mt-4 border-gray-300" />
        <p className="text-center text-xs text-gray-400 mt-4">Secured by Trendify</p>
      </div>
    </div>
  );
};

export default Register;
