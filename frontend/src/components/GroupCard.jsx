import { motion } from "framer-motion";
import GradientButton from "./GradientButton"; // Assuming you have this component

const GroupCard = ({ name, code, onViewGroup }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 bg-opacity-70 p-6 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-semibold text-green-300 mb-2">{name}</h2>
      <p className="text-gray-400 mb-4">Code: {code}</p>
      <GradientButton
        label="View Group"
        onClick={onViewGroup}
        className="mt-0" // Ensure mt-0 applies correctly
      />
    </motion.div>
  );
};

export default GroupCard;
