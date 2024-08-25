import { useAuthStore } from "../../store/authStore";
import { Navigate } from "react-router-dom";

const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (isAuthenticated && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

export default ProtectRoute;
