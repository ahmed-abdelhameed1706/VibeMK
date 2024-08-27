import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import GradientButton from "../../components/GradientButton";
import Input from "../../components/Input";
import { useGroupStore } from "../../store/groupStore";

const HomePage = () => {
  const { user, isLoading } = useAuthStore();
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const navigate = useNavigate();

  const { group, createGroup, error } = useGroupStore();

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await createGroup(groupName);
      navigate(`/group/${group.code}`); // Navigate to a relevant page after creation
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  const joinGroup = (e) => {
    e.preventDefault();
    navigate(`/group/${groupCode}`);
  };

  const navigateToMyGroups = (e) => {
    e.preventDefault();
    navigate("/my-groups");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Welcome, {user?.fullName || "User"}
        </h2>

        <div className="space-y-6">
          <motion.div
            className="bg-gray-900 bg-opacity-50 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4 text-center text-green-500">
              Create a New Group
            </h3>
            <form onSubmit={handleCreateGroup}>
              <Input
                icon={Users}
                type="text"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <GradientButton
                type="submit"
                label={"Create Group"}
                isLoading={isLoading}
                className="!mt-0"
              />
            </form>
          </motion.div>

          <motion.div
            className="bg-gray-900 bg-opacity-50 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4 text-center text-green-500">
              Join an Existing Group
            </h3>
            <form onSubmit={joinGroup}>
              <Input
                icon={Users}
                type="text"
                placeholder="Enter group code"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value)}
              />
              <GradientButton
                type="submit"
                label="Join Group"
                isLoading={isLoading}
                className="!mt-0"
              />
            </form>
          </motion.div>

          <motion.div
            className="bg-gray-900 bg-opacity-50 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4 text-center text-green-500">
              Your Groups
            </h3>
            <p className="text-gray-400 mb-4 text-center">
              Manage and view the groups you are part of.
            </p>
            <GradientButton
              label="View My Groups"
              onClick={navigateToMyGroups}
              isLoading={isLoading}
              className="!mt-0"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;
