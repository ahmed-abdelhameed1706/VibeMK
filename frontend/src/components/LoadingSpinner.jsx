import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <motion.div
      className="w-16 h-16 border-4 border-t-4 border-t-green-500 border-green-200 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

export default LoadingSpinner;
