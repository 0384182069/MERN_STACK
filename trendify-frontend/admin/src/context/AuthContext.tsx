import axios from "axios";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "react-toastify";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userData: any;
  setUserData: (data: any) => void;
  Backend_API: string;
  getUserData: () => Promise<void>;
  getAuthState: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const Backend_API = import.meta.env.VITE_BACKEND_URL;

  const getUserData = async () => {
    try {
      axios.defaults.withCredentials = true;
      const endpoint = "/api/user/data";
      const { data } = await axios.get(`${Backend_API}${endpoint}`);
      if (data.user?.isAccountVerified) {
        setUserData(data.user);
        setIsLoggedIn(true);
      } else {
        setUserData(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      toast.error("Something went wrong while fetching user data!");
      setUserData(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getAuthState = async () => {
    try {
      axios.defaults.withCredentials = true;
      const endpoint = "/api/auth/is-auth";
      const { data } = await axios.get(`${Backend_API}${endpoint}`);
      if(data.success){
        await getUserData();
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      setIsLoggedIn(false);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Chỉ kiểm tra trạng thái xác thực một lần khi mount
  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    Backend_API,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    getAuthState,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
