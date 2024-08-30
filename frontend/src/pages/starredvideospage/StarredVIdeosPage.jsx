import VideoCard from "../../components/VideoCard";
import GradientButton from "../../components/GradientButton";

import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";
import LoadingSpinner from "../../components/LoadingSpinner";

import { useVideoStore } from "../../store/videoStore";

import { useEffect } from "react";

const StarredVideosPage = () => {
  const { user, isLoading } = useAuthStore();
  const {
    deleteVideo,
    starVideo,
    starredVideos,
    getStarredVideos,
    getUserVideos,
  } = useVideoStore();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStarredVideos = async () => {
      try {
        await getStarredVideos();
      } catch (error) {
        console.error("Failed to get starred videos", error);
      }
    };
    fetchStarredVideos();
  }, [getStarredVideos, getUserVideos]);

  const handleBackToMyGroups = () => {
    navigate("/my-groups");
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      await deleteVideo(videoId);
      await getStarredVideos();
    } catch (error) {
      console.error("Failed to delete video", error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="p-4 md:p-8 flex flex-col bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      <div className="flex flex-col md:flex-row flex-grow">
        <div className="hidden md:flex md:w-[300px] md:h-[150px] md:fixed md:left-0 md:top-1/2 md:-translate-y-1/2 md:overflow-y-auto md:rounded-lg md:p-4 md:shadow-lg">
          <div className="flex flex-col justify-between h-full">
            {/* Buttons arranged in rows of two */}
            <div className="mt-4 flex flex-wrap gap-2">
              <GradientButton
                label="My Groups"
                onClick={handleBackToMyGroups}
                className="flex-1 md:w-[calc(50%-0.5rem)]"
              />
            </div>
          </div>
        </div>
        <div className="mb-4 flex justify-between items-center gap-4 md:hidden">
          <GradientButton label="My Groups" onClick={handleBackToMyGroups} />
        </div>

        {/* Videos */}
        <div className="flex-1 md:min-w-[640px] flex flex-col ml-0 md:ml-6 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-lg shadow-lg p-4 md:p-6 overflow-hidden">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-green-500">
            Videos
          </h2>
          <div className="h-[580px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            ) : user.starredVideos.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-white">
                  You do not have any starred videos
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {starredVideos.map((video) => {
                  const userIsOwner = video.owner === user._id;

                  return (
                    <VideoCard
                      key={video._id}
                      videoId={video._id}
                      url={video.url}
                      updatedAt={video.updatedAt}
                      seenBy={video.seenBy.map((user) => user.fullName)}
                      userIsOwner={userIsOwner}
                      onDelete={() => handleDeleteVideo(video._id)}
                      onStar={() => starVideo(video._id)}
                      starred={true}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StarredVideosPage;
