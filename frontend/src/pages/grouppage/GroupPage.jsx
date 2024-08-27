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
  const { groupMembers, getGroup, isLoading, error, group } = useGroupStore();
  const { addVideo, videoError, videoIsLoading, getVideosForUser, userVideos } =
    useVideoStore();

  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [isDefaultGroup, setIsDefaultGroup] = useState(false);
  const [isFetchingVideos, setIsFetchingVideos] = useState(true);

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

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setIsUserModalOpen(false); // Close the user list modal on selection
  };

  const handleInviteToGroup = () => {
    setIsModalOpen(true);
  };

  const handleLeaveGroup = () => {
    navigate("/my-groups");
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
    const newStatus = !isDefaultGroup;
    setIsDefaultGroup(newStatus);
    localStorage.setItem("defaultGroup", newStatus.toString());

    if (newStatus) {
      localStorage.setItem("defaultGroupPage", code);
    } else {
      localStorage.removeItem("defaultGroupPage");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 md:p-8 flex flex-col bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      {/* Back to My Groups Button */}
      <div className="mb-4 flex justify-between items-center gap-4">
        <GradientButton label="My Groups" onClick={handleBackToMyGroups} />
        <GradientButton
          label={isDefaultGroup ? "Remove Default" : "Set as Default"}
          onClick={handleToggleDefaultGroup}
        />
      </div>
      {(error || videoError) && (
        <p className="text-red-500 text-center">{error ? error : videoError}</p>
      )}

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
      <div className="flex flex-col space-y-4 mt-4 md:mt-0">
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
