import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GroupMember from "../../components/GroupMember";
import VideoCard from "../../components/VideoCard";
import GradientButton from "../../components/GradientButton";
import Modal from "../../components/Modal";
import { Send } from "lucide-react";
import { useGroupStore } from "../../store/groupStore";
import { useVideoStore } from "../../store/videoStore";
import LoadingSpinner from "../../components/LoadingSpinner";

const GroupPage = () => {
  const navigate = useNavigate();
  const {
    groupMembers,
    getGroup,
    isLoading,
    error,
    group,
    toggleDefaultGroup,
    defaultGroupCode,
    defaultGroupName,
    leaveGroup,
    getGroupsForUser,
  } = useGroupStore();
  const { addVideo, videoError, videoIsLoading, getVideosForUser, userVideos } =
    useVideoStore();

  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [isFetchingVideos, setIsFetchingVideos] = useState(true);
  const [currentDefaultGroupName, setCurrentDefaultGroupName] = useState("");

  const { code } = useParams();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        await getGroup(code);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGroup();
  }, [getGroup, code]);

  useEffect(() => {
    if (groupMembers.length > 0) {
      setSelectedMember(groupMembers[0]);
    }
  }, [groupMembers]);

  useEffect(() => {
    const fetchVideosForUser = async () => {
      if (selectedMember) {
        setIsFetchingVideos(true);
        try {
          await getVideosForUser(selectedMember._id, group._id);
        } catch (error) {
          console.error(error);
        } finally {
          setIsFetchingVideos(false);
        }
      }
    };

    fetchVideosForUser();
  }, [getVideosForUser, selectedMember, group]);

  useEffect(() => {
    setCurrentDefaultGroupName(defaultGroupName);
  }, [defaultGroupName]);

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setIsUserModalOpen(false); // Close the user list modal on selection
  };

  const handleInviteToGroup = () => {
    setIsModalOpen(true);
  };

  const handleLeaveGroup = async () => {
    try {
      leaveGroup(group._id);
      await getGroupsForUser();
      navigate("/my-groups");
    } catch (error) {
      console.error(error);
    }
  };

  const handleBackToMyGroups = () => {
    navigate("/my-groups");
  };

  const handleAddVideo = async () => {
    try {
      await addVideo(newVideoUrl, group._id);
      if (selectedMember) {
        await getVideosForUser(selectedMember._id, group._id);
      }
    } catch (error) {
      console.error(error);
    }
    setNewVideoUrl("");
  };

  const handleToggleDefaultGroup = () => {
    toggleDefaultGroup(group.code);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 md:p-8 flex flex-col bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      {/* Group Information Section on medium screens*/}

      <div className="hidden md:flex md:w-[300px] md:h-[450px] md:fixed md:left-0 md:top-1/2 md:-translate-y-1/2 md:overflow-y-auto md:rounded-lg md:p-4 md:shadow-lg">
        <div className="flex flex-col justify-between h-full">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-green-500">
              {group?.name}
            </h1>
            <p className="text-sm md:text-base text-gray-400">
              Code: {group?.code}
            </p>
          </div>
          {defaultGroupName ? (
            <p className="mt-2 text-sm md:text-base text-green-400">
              Default Group : {currentDefaultGroupName}
            </p>
          ) : (
            ""
          )}
          {/* Buttons arranged in rows of two */}
          <div className="mt-4 flex flex-wrap gap-2">
            <GradientButton
              label="My Groups"
              onClick={handleBackToMyGroups}
              className="flex-1 md:w-[calc(50%-0.5rem)]"
            />
            <GradientButton
              label={
                defaultGroupCode === group?.code
                  ? "Remove Default"
                  : "Set as Default"
              }
              onClick={handleToggleDefaultGroup}
              className="flex-1 md:w-[calc(50%-0.5rem)]"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <GradientButton
              label="Leave Group"
              onClick={handleLeaveGroup}
              className="flex-1 md:w-[calc(50%-0.5rem)]"
            />
            <GradientButton
              label="Invite to Group"
              onClick={handleInviteToGroup}
              className="flex-1 md:w-[calc(50%-0.5rem)]"
            />
          </div>
        </div>
      </div>

      {/* Back to My Groups Button */}
      <div className="mb-4 flex justify-between items-center gap-4 md:hidden">
        <GradientButton label="My Groups" onClick={handleBackToMyGroups} />
        <GradientButton
          label={
            defaultGroupCode === group?.code
              ? "Remove Default"
              : "Set as Default"
          }
          onClick={handleToggleDefaultGroup}
        />
      </div>
      {(error || videoError) && (
        <p className="text-red-500 text-center">{error ? error : videoError}</p>
      )}

      {/* Group Information Section on mobile screens*/}
      <div className="md:hidden mb-4 flex flex-col md:flex-row justify-between items-center bg-gray-800 bg-opacity-50 rounded-lg p-4 shadow-lg">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-green-500">
            {group?.name}
          </h1>
          <p className="text-sm md:text-base text-gray-400">
            Code: {group?.code}
          </p>
        </div>
        {defaultGroupName ? (
          <p className="mt-2 md:mt-0 text-sm md:text-base text-green-400 md:ml-4">
            Default Group : {currentDefaultGroupName}
          </p>
        ) : (
          ""
        )}
      </div>

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Group Members (Hidden on Mobile) */}
        <div className="hidden md:block w-full md:w-1/4 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-lg shadow-lg p-4 md:p-6 mb-4 md:mb-0">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-green-500">
            Group Members
          </h2>
          <ul className="space-y-4">
            {groupMembers.map((member, index) => (
              <GroupMember
                key={index}
                name={member.fullName}
                lastLogin={member.lastLogin}
                onClick={() => handleSelectMember(member)}
                isSelected={selectedMember === member}
              />
            ))}
          </ul>
        </div>

        {/* Videos */}
        <div className="flex-1 md:min-w-[640px] flex flex-col ml-0 md:ml-6 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-lg shadow-lg p-4 md:p-6 overflow-hidden">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-green-500">
            Videos
          </h2>

          {/* Video Input Section */}
          <div className="mb-4 flex items-center">
            <input
              type="text"
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              placeholder="Enter video URL"
              className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border
                        border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500
                        text-white placeholder-gray-400 transition duration-200 outline-none"
            />
            <GradientButton
              label={<Send size={24} />}
              onClick={handleAddVideo}
              isLoading={videoIsLoading}
              className="ml-2 inline-flex items-center justify-center space-x-2 !text-sm flex-1 !mt-0 h-10 w-6"
            />
          </div>

          <div className="h-[580px] overflow-y-auto">
            {isFetchingVideos ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            ) : userVideos.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-white">
                  "{selectedMember?.fullName}" has not shared any videos yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userVideos.map((video, index) => (
                  <VideoCard
                    key={index}
                    videoId={video._id}
                    url={video.url}
                    updatedAt={video.updatedAt}
                    seenBy={video.seenBy
                      .map((user) => user.fullName)
                      .join(", ")}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex flex-col md:hidden">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2 text-green-500">
            {selectedMember?.fullName}
          </h2>
          <GradientButton
            label="Change User"
            onClick={() => setIsUserModalOpen(true)}
          />
        </div>

        {/* User List Modal for Mobile */}
        {isUserModalOpen && (
          <Modal onClose={() => setIsUserModalOpen(false)}>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-center text-green-500">
              Select User
            </h2>
            <ul className="space-y-2">
              {groupMembers.map((member, index) => (
                <li
                  key={index}
                  className={`cursor-pointer p-2 text-white${
                    selectedMember === member ? "bg-green-600 text-white" : ""
                  }`}
                  onClick={() => handleSelectMember(member)}
                >
                  {member.fullName}
                </li>
              ))}
            </ul>
          </Modal>
        )}
      </div>

      {/* Bottom Left Buttons */}
      <div className="flex flex-col space-y-4 mt-4 md:mt-0 md:hidden">
        <div className="md:fixed md:bottom-4 md:left-4 flex space-x-4">
          <GradientButton label="Leave Group" onClick={handleLeaveGroup} />
          <GradientButton
            label="Invite to Group"
            onClick={handleInviteToGroup}
          />
        </div>
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-center text-green-500">
            Invite to Group
          </h2>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full p-2 mb-4 bg-gray-800 rounded-lg"
          />
          <GradientButton
            label="Send Invitation"
            onClick={() => {
              /* Handle send invitation */
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default GroupPage;
