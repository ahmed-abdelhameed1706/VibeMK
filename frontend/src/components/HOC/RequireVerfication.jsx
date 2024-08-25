import { Outlet, Navigate } from "react-router-dom";

export const RequireVerification = ({ user, isVerified }) => {
  if (user && !isVerified) {
    return <Navigate to="/verify-email" />;
  }
  return <Outlet />;
};
