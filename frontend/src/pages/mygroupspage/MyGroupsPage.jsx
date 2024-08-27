import GroupCard from "../../components/GroupCard";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useGroupStore } from "../../store/groupStore";

import LoadingSpinner from "../../components/LoadingSpinner";

const MyGroupsPage = () => {
  const navigate = useNavigate();
  const { userGroups, getGroupsForUser, isLoading } = useGroupStore();

  useEffect(() => {
    getGroupsForUser();
  }, [getGroupsForUser]);

  const handleViewGroup = (groupCode) => {
    // Placeholder function for handling group view
    navigate(`/group/${groupCode}`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] p-8 ">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text p-8">
        My Groups
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {userGroups.map((group, index) => (
          <GroupCard
            key={index}
            name={group.name}
            code={group.code}
            onViewGroup={() => handleViewGroup(group.code)}
          />
        ))}
      </div>
    </div>
  );
};

export default MyGroupsPage;
