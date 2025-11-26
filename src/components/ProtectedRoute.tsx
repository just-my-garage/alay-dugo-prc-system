import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/pages/auth/auth.context";
import Loading from "./loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireAuth?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  requireAuth = false 
}: ProtectedRouteProps) => {
  const { session, userProfile, isLoading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Give a brief moment for auth to initialize
    const timer = setTimeout(() => {
      setChecking(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [session, userProfile]);

  if (isLoading || checking) {
    return <Loading component={false}/>;
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !session) {
    return <Navigate to="/donor-login" replace />;
  }

  // If admin is required but user is not admin
  if (requireAdmin && (!session || !userProfile?.is_admin)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
