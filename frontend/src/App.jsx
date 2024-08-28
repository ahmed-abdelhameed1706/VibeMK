import FloatingShape from "./components/FloatingShape";
import { Routes, Route, Navigate } from "react-router-dom";

import SignUpPage from "./pages/signuppage/SignUpPage";
import LoginPage from "./pages/loginpage/LoginPage";
import VerifyEmailPage from "./pages/verifyemailpage/VerifyEmailPage";
import HomePage from "./pages/homepage/HomePage";
import ForgotPasswordPage from "./pages/forgotpasswordpage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/resetpasswordpage/ResetPasswordPage";
import MyGroupsPage from "./pages/mygroupspage/MyGroupsPage";
import GroupPage from "./pages/grouppage/GroupPage";

import { useAuthStore } from "./store/authStore";
import { useGroupStore } from "./store/groupStore";
import { useEffect } from "react";

import ProtectRoute from "./components/Redirects/ProtectRoute";
import RedirectAuthenticatedUsers from "./components/Redirects/RedirectAuthenticatedUsers";
import LoadingSpinner from "./components/LoadingSpinner";
import Header from "./components/Header/Header";
import DashboardPage from "./pages/dashboardpage/DashboardPage";

function App() {
  const { user, getMe, isCheckingAuth, isAuthenticated } = useAuthStore();
  const { defaultGroupCode } = useGroupStore();

  useEffect(() => {
    getMe();
  }, [getMe]);

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br 
    from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden"
    >
      {/* Floating Shapes */}
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />

      <FloatingShape
        color="bg-green-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />

      <FloatingShape
        color="bg-green-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      {/* Header */}
      {isAuthenticated && <Header />}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        {isCheckingAuth && <LoadingSpinner />}

        {!isCheckingAuth && (
          <Routes>
            <Route
              path="/"
              element={
                <ProtectRoute>
                  {defaultGroupCode ? (
                    <Navigate to={`/group/${defaultGroupCode}`} />
                  ) : (
                    <HomePage />
                  )}
                </ProtectRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/register"
              element={
                <RedirectAuthenticatedUsers>
                  <SignUpPage />
                </RedirectAuthenticatedUsers>
              }
            />
            <Route
              path="/login"
              element={
                <RedirectAuthenticatedUsers>
                  <LoginPage />
                </RedirectAuthenticatedUsers>
              }
            />
            <Route
              path="/verify-email"
              element={
                isAuthenticated && !user.isVerified ? (
                  <VerifyEmailPage />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route
              path="/forgot-password"
              element={
                <RedirectAuthenticatedUsers>
                  <ForgotPasswordPage />
                </RedirectAuthenticatedUsers>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <RedirectAuthenticatedUsers>
                  <ResetPasswordPage />
                </RedirectAuthenticatedUsers>
              }
            />
            <Route
              path="/my-groups"
              element={
                <ProtectRoute>
                  <MyGroupsPage />
                </ProtectRoute>
              }
            />
            <Route
              path="/group/:code"
              element={
                <ProtectRoute>
                  <GroupPage />
                </ProtectRoute>
              }
            />
            <Route path="*" element={"404 - Page Not Found"} />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;
