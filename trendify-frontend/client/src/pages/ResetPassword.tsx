import { imgs } from '@/assets/constants'
import Input from '@/components/InputProps';
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('')
  const [verifiedOtp, setVerifiedOtp] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const {Backend_API} = useAuth();
  const [resendTimer, setResendTimer] = useState(15);
  const [canResend, setCanResend] = useState(false);
  const [step, setStep] = useState(0);

  const trimmedEmail = email.trim();


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
    e.preventDefault();
    axios.defaults.withCredentials = true;
    try {
      const otpArray = inputRefs.current.map(e => e?.value);
      const otp = otpArray.join('');
      const endpoint = "/api/auth/match-otp"
      const body = {email: email, otp: otp}

      const {data} = await axios.post(`${Backend_API}${endpoint}`,body)
      if(data.success){
        setVerifiedOtp(otp); 
        setStep(2)
        toast.success(data.message)
      }
      else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error("An error occurred during verification.", { autoClose: 2000 });
    }
  }

  const handleEmail = async(e: React.FormEvent)=>{
    e.preventDefault();
    axios.defaults.withCredentials = true;
    try {
      const endpoint = "/api/auth/send-reset-otp";
      const boby = {email: trimmedEmail};
      const {data} = await axios.post(`${Backend_API}${endpoint}`,boby)
      if(data.success){
        setStep(1);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error("Email does not exist")
    }
  }

  const handleNewPassword = async (e: React.FormEvent)=>{
    e.preventDefault();
    axios.defaults.withCredentials = true;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const trimmedPassword = newPassword.trim();
    const trimmedConfirm = confirm.trim();

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
      return toast.error("New passwords do not match. Please try again.");
    }

    const body = {email: email, otp: verifiedOtp ,newpassword: newPassword}
    console.log(body);
    try {
      const endpoint = "/api/auth/reset-password"
      const {data} = await axios.post(`${Backend_API}${endpoint}`,body)
      if(data.success){
        toast.success(data.message, {autoClose: 1000})
        navigate('/login')
      }
    } catch (error) {
      toast.error("Failed to reset password. Please try again.", {autoClose: 1000});
    }
  }


  const sendOtp = async () => {
    try {
      setCanResend(false);
      setResendTimer(15); 
      const endpoint = "/api/auth/send-reset-otp";
      const boby = {email: trimmedEmail};
      const {data} = await axios.post(`${Backend_API}${endpoint}`,boby)
      if(data.success){
        toast.success(data.message,{ autoClose: 1000 });
      }
      else{
        toast.error(data.message,{autoClose: 1000});
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

  return (
    <>
    {/* Enter email */}
    {step === 0 && (
        <div className="flex items-center justify-center min-h-[80vh] sm:px-0">
          <div className="border border-gray-300 py-6 px-10 rounded-lg shadow-2xl w-full sm:w-96 text-sm bg-white">
            <div className="flex justify-center">
              <img src={imgs.logo} alt="logo" className="w-28 h-auto" />
          </div>
          <h2 className="text-xl font-semibold text-center mt-3">Reset Password</h2>
          <p className="text-sm text-center text-gray-600 mb-6">Enter your registered email address</p>
          <form onSubmit={handleEmail}>
            <div className='mb-4'>
              <Input
                label="Email address"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
              </div>
              <Button className="w-full mb-4 py-2.5 font-medium rounded-full bg-gradient-to-r from-webprimary to-websecondary hover:opacity-80 transition duration-200">
                Continue
              </Button>
            </form>
          </div>
        </div>
    )}
    {/* Enter OTP reset */}
    {step === 1 &&(
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
             <Button  className="w-full py-2.5 font-medium rounded-full bg-gradient-to-r from-webprimary to-websecondary hover:opacity-80 transition duration-200">
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
    )}
    {/* Enter newpassword*/}
    {step === 2 &&(
        <div className="flex  items-center justify-center min-h-[80vh] sm:px-0">
          <div className="border border-gray-300 py-6 px-10 rounded-lg shadow-2xl w-full sm:w-96 text-sm bg-white">
            <div className="flex justify-center">
              <img src={imgs.logo} alt="logo" className="w-28 h-auto" />
            </div>
            <h2 className="text-xl font-semibold text-center mt-3">New password</h2>
            <p className="text-sm text-center text-gray-600 mb-6">Enter the new password below</p>
            <form onSubmit={handleNewPassword}>
              <div className='mb-4'>
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={newPassword}
                  onChange={(e)=>setNewPassword(e.target.value)}
                />
              </div>
              <div className='mb-4'>
                <Input
                  label="Confirm passowrd"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirm}
                  onChange={(e)=>setConfirm(e.target.value)}
                />
              </div>
              <Button className="w-full mb-4 py-2.5 font-medium rounded-full bg-gradient-to-r from-webprimary to-websecondary hover:opacity-80 transition duration-200">
                Done
              </Button>
            </form>
          </div>
        </div>
    )}
    </>
    
  )
}

export default ResetPassword;
