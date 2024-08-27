import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import Input from "../../components/Input";
import { Shield, RefreshCcw, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    isLoading,
    updatePassword,
    error,
    message,
    resetTokenValidate,
    checkTokenValidation,
  } = useAuthStore();

  const { token } = useParams();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(token, password, confirmPassword);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkTokenValidation(token);
  }, [checkTokenValidation, token]);

  if (!resetTokenValidate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Invalid Token
          </h2>
          <p className="text-red-500 text-sm mb-6">
            The token is invalid or has expired. Please request a new password
            reset link.
          </p>
        </div>
        <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
          <Link
            to="/login"
            className="text-sm text-green-400 hover:underline flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Update Password
        </h2>
        {error && <p className="text-red-500 text-sm mb-6">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-6">{message}</p>}

        <form onSubmit={handleSubmit}>
          <Input
            icon={Shield}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            icon={RefreshCcw}
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <PasswordStrengthMeter
            password={password}
            confirmPassword={confirmPassword}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600
              text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
          >
            {isLoading ? (
              <Loader className="size-6 animate-spin mx-auto" />
            ) : (
              "Update Password"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <Link
          to="/login"
          className="text-sm text-green-400 hover:underline flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
        </Link>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
