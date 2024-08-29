import { motion } from "framer-motion";
import { formatDate } from "../utils/date";

import "react-tooltip/dist/react-tooltip.css";

import { Tooltip } from "react-tooltip";

import { useVideoStore } from "../store/videoStore";

import { Edit, Trash } from "lucide-react";

import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const VideoCard = ({ url, updatedAt, seenBy, videoId }) => {
  const { updateSeenBy, video, getVideo } = useVideoStore();
  const { user } = useAuthStore();

  const handleSeenBy = async () => {
    try {
      await updateSeenBy(videoId);
    } catch (error) {
      console.error("Failed to update seen by", error);
    }
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        await getVideo(videoId);
      } catch (error) {
        console.error("Failed to fetch video", error);
      }
    };
    fetchVideo();
  }, [videoId, getVideo]);

  const splitUrl = (url) => {
    const httpIndex = url.indexOf("http");
    if (httpIndex === -1) return { before: url, after: "" };

    return {
      before: url.slice(0, httpIndex),
      after: url.slice(httpIndex),
    };
  };

  const { before, after } = splitUrl(url);

  console.log("user is ", user.fullName);
  console.log("video is ", video);
  console.log("video owner is ", video?.owner.fullName);

  const handleEdit = () => {};

  const handleDelete = () => {};
  return (
    <motion.div
      className="p-4 bg-gray-800 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="mb-2 text-white">{before}</p>
      {after && (
        <a
          href={after}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-500 underline"
          onClick={handleSeenBy}
        >
          {after.length > 19 ? `${after.slice(0, 19)}...` : after}
        </a>
      )}
      <p className="text-gray-400 text-sm mt-2">
        Updated at: {formatDate(updatedAt)}
      </p>
      <p>
        Seen by:{" "}
        {seenBy.map((user, index) => (
          <span
            key={index}
            style={{ color: getRandomColor() }}
            className="user-name"
          >
            {user}
            {index < seenBy.length - 1 && ", "}
          </span>
        ))}
      </p>
    </motion.div>
  );
};

export default VideoCard;
