/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

const GradientButton = ({
  label,
  onClick,
  isLoading,
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <motion.button
      className={`mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white
      font-bold rounded-lg shadow-lg hover:from-green-600
      hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
      focus:ring-offset-gray-900 transition duration-200 ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : label}
    </motion.button>
  );
};

export default GradientButton;
