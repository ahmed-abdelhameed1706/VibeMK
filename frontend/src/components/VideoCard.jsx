import { motion } from "framer-motion";
import { formatDate } from "../utils/date";
import Modal from "./Modal";
import GradientButton from "./GradientButton";
import { useEffect, useState } from "react";

import "react-tooltip/dist/react-tooltip.css";

import { Tooltip } from "react-tooltip";

import { useVideoStore } from "../store/videoStore";

import { Edit, Trash, Star } from "lucide-react";

const getRandomColor = () => {
  let color;
  do {
    color = "#";
    for (let i = 0; i < 6; i++) {
      color += "0123456789ABCDEF"[Math.floor(Math.random() * 16)];
    }
  } while (!isLightColor(color));

  return color;
};

const isLightColor = (hex) => {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Calculate luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Return true if luminance is high enough
  return luminance > 186; // Adjust threshold as needed
};

const VideoCard = ({
  url,
  updatedAt,
  seenBy,
  videoId,
  userIsOwner,
  onDelete,
  starred,
  onStar,
}) => {
  const { updateSeenBy, updateVideo } = useVideoStore();
  const [isStarred, setIsStarred] = useState(starred);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedUrl, setupdatedUrl] = useState("");

  const handleSeenBy = async () => {
    try {
      await updateSeenBy(videoId);
    } catch (error) {
      console.error("Failed to update seen by", error);
    }
  };

  const handleStar = async () => {
    setIsStarred(!isStarred); // Optimistic update
    try {
      await onStar(videoId);
    } catch (error) {
      setIsStarred(isStarred); // Revert on error
      console.error("Failed to star video", error);
    }
  };

  useEffect(() => {
    setupdatedUrl(url);
  }, [url]);

  const splitUrl = (url) => {
    // Find the index of the first "http"
    const httpIndex = url.indexOf("http");

    // If "http" is not found, return the entire string as before
    if (httpIndex === -1) return { before: url, after: "" };

    // Find the index of the first space after "http"
    const spaceIndex = url.indexOf(" ", httpIndex);

    // If there's no space after the URL, take the rest of the string as part of the URL
    const endOfUrlIndex = spaceIndex === -1 ? url.length : spaceIndex;

    // Get the before and after parts
    const beforePart =
      url.slice(0, httpIndex).trim() + " " + url.slice(endOfUrlIndex).trim();
    const afterPart = url.slice(httpIndex, endOfUrlIndex).trim();

    // Split the before part into lines with a maximum of 30 characters each
    const wrappedBeforePart = beforePart
      .match(/.{1,30}/g) // Match up to 30 characters at a time
      .join("\n"); // Join lines with a newline character

    return {
      before: wrappedBeforePart,
      after: afterPart,
    };
  };
  const { before, after } = splitUrl(url);

  const handleEdit = async () => {
    try {
      if (updatedUrl) {
        await updateVideo(videoId, updatedUrl);
        setIsModalOpen(false);
        setIsStarred(starred);
      }
    } catch (error) {
      console.error("Failed to update video", error);
    }
  };

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

      <div className="flex justify-end mt-4 gap-2">
        {userIsOwner && (
          <>
            <Edit
              size={24}
              className="cursor-pointer text-green-500"
              data-tip="Edit"
              onClick={() => setIsModalOpen(true)}
            />
            <Trash
              size={24}
              className="cursor-pointer text-red-500 hover:text-red-500 transition-colors duration-200 hover:fill-current"
              data-tip="Delete"
              onClick={onDelete}
            />
          </>
        )}

        <Star
          size={24}
          className={`cursor-pointer transition-colors duration-200 ${
            starred
              ? "text-yellow-400 fill-current hover:text-yellow-300"
              : "text-gray-400 hover:text-yellow-200 hover:fill-current"
          }`}
          onClick={handleStar}
          data-tip={starred ? "Unstar" : "Star"}
        />
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-center text-green-500">
            Edit Video URL
          </h2>
          <input
            type="text"
            placeholder="Video URL"
            className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border
                        border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500
                        text-white placeholder-gray-400 transition duration-200 outline-none"
            value={updatedUrl}
            onChange={(e) => setupdatedUrl(e.target.value)}
          />
          <GradientButton label="Submit Edit" onClick={handleEdit} />
        </Modal>
      )}
    </motion.div>
  );
};

export default VideoCard;
