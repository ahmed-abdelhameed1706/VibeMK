import { useAuthStore } from "../../store/authStore";
import { Navigate } from "react-router-dom";

const RedirectAuthenticatedUsers = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

export default RedirectAuthenticatedUsers;
