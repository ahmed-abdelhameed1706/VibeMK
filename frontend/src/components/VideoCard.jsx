import { motion } from "framer-motion";
import { formatDate } from "../utils/date";

import "react-tooltip/dist/react-tooltip.css";

import { Tooltip } from "react-tooltip";

import { useVideoStore } from "../store/videoStore";

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const VideoCard = ({ url, updatedAt, seenBy, videoId }) => {
  const { updateSeenBy } = useVideoStore();

  const handleSeenBy = async () => {
    try {
      await updateSeenBy(videoId);
    } catch (error) {
      console.error("Failed to update seen by", error);
    }
  };
  return (
    <motion.div
      className="p-4 bg-gray-800 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-500 underline"
        onClick={handleSeenBy}
      >
        <p data-tooltip-id="my-tooltip" data-tooltip-content={url}>
          {url.length > 19 ? `${url.slice(0, 19)}...` : url}
        </p>
        <Tooltip id="my-tooltip" />
      </a>
      <p className="text-gray-400 text-sm mt-2">
        Updated at: {formatDate(updatedAt)}
      </p>
      <p>
        Seen by: {seenBy.map((user, index) => (
          <span
            key={index}
            style={{ color: getRandomColor() }}
            className="user-name"
          >
            {user}
            {index < seenBy.length - 1 && ', '}
          </span>
        ))}
      </p>
    </motion.div>
  );
};

export default VideoCard;
