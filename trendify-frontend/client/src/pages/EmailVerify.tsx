import { imgs } from "@/assets/constants";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const {Backend_API,getUserData} = useAuth();
  const [resendTimer, setResendTimer] = useState(15);
  const [canResend, setCanResend] = useState(false);


  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const inputElement = e.target as HTMLInputElement; 
    if (e.key === "Backspace" && inputElement.value === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6); 
    const pasteArray = paste.split("");
    
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index]!.value = char;
      }
    });

    if (pasteArray.length < 6 && inputRefs.current[pasteArray.length]) {
      inputRefs.current[pasteArray.length]!.focus();
    }
  };

  const handleVerify = async(e: React.FormEvent)=>{
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      const endpoint = "/api/auth/verify-account";
      const otpArray = inputRefs.current.map(e => e?.value);
      const otp = otpArray.join('');
      const {data} = await axios.post(`${Backend_API}${endpoint}`,{otp})
      if(data.success){
        toast.success(data.message,{ autoClose: 1000 });
        getUserData();
        navigate('/');
      }
      else{
        toast.error("Verification failed. Please try again.", { autoClose: 1000 });
      }
    } catch (error) {
      toast.error("An error occurred during verification.", { autoClose: 1000 });
    }
  }

  const sendOtp = async () => {
    try {
      setCanResend(false);
      setResendTimer(15); 
      const endpoint = "/api/auth/send-verify-otp"
      const {data} = await axios.post(`${Backend_API}${endpoint}`);
      if(data.success){
        toast.success("OTP has been sent to your email.",{ autoClose: 1000 });
      }
      const countdown = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error("Failed to send OTP.", {autoClose: 1000});
      setCanResend(true);
    }
  };

  useEffect(() => {
    sendOtp();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[80vh] sm:px-0">
      <div className="border border-gray-300 py-6 px-10 rounded-lg shadow-2xl w-full sm:w-96 text-sm bg-white">
        <div className="flex justify-center">
          <img src={imgs.logo} alt="logo" className="w-28 h-auto" />
        </div>
        <h2 className="text-xl font-semibold text-center mt-3">Email Verify OTP</h2>
        <p className="text-sm text-center text-gray-600 mb-6">Enter the 6-digit code sent to your email</p>

        <form onSubmit={handleVerify}>
          <div className="flex justify-between mb-6" onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                required
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e as React.ChangeEvent<HTMLInputElement>, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-xl rounded-md bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <Button className="w-full py-2.5 font-medium rounded-full bg-gradient-to-r from-webprimary to-websecondary hover:opacity-80 transition duration-200">
            Verify
          </Button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">
            Didn't receive the code?
          </p>
          <button
            onClick={sendOtp}
            disabled={!canResend}
            className={`mt-2 text-blue-500 text-sm font-semibold ${!canResend ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
          >
            {canResend ? "Resend OTP" : `Resend OTP in ${resendTimer}s`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
