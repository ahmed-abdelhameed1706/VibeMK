import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { Stars } from "lucide-react";

const Header = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const isActive = location.pathname === "/starred";

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
        <Link to="/starred">
          <p
            className={`inline-flex items-center border border-transparent transition-colors duration-200 ${
              isActive
                ? "text-yellow-500"
                : "text-gray-400 hover:text-yellow-500"
            }`}
          >
            Starred{" "}
            <Stars className={`ml-1 ${isActive ? "fill-current " : ""}`} />
          </p>
        </Link>
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
