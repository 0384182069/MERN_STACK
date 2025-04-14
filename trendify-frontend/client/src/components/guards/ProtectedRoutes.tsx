import { Navigate, Outlet,useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const AuthRoutes = () => {
  const { isLoggedIn } = useAuth();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  
  if (isLoggedIn) {
    return <Navigate to={returnUrl} replace />;
  }

  return <Outlet />;
};

export const ProtectedRoutes = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation(); 

  if (!isLoggedIn) {
    const returnUrl = `/login?returnUrl=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={returnUrl}/>;
  }

  return <Outlet />;
};