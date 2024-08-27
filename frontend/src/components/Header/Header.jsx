import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";

const Header = () => {
  const { user } = useAuthStore();
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-xl shadow-md flex items-center justify-between p-4 w-full"
    >
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img src={"/vibemkpng.svg"} alt="Logo" className="w-12 h-12" />
        </Link>
      </div>

      {/* User Name */}
      <div className="flex items-center space-x-4">
        <Link
          to="/dashboard"
          className="text-green-500 hover:underline font-semibold"
        >
          {user.fullName}
        </Link>
      </div>
    </motion.header>
  );
};

export default Header;
