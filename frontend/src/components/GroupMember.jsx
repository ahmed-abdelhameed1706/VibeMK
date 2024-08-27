import { motion } from "framer-motion";
import { formatDate } from "../utils/date";
const GroupMember = ({ name, lastLogin, onClick, isSelected }) => {
  return (
    <motion.li
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        isSelected ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
      }`}
    >
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm">Last login: {formatDate(lastLogin)}</p>
    </motion.li>
  );
};

export default GroupMember;
