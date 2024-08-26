import mongoose from "mongoose";

export const validateVideoObjectId = (req, res, next) => {
  const { groupId, videoId } = req.body;

  let invalidIds = [];

  if (groupId && !mongoose.Types.ObjectId.isValid(groupId)) {
    invalidIds.push("group ID");
  }

  if (videoId && !mongoose.Types.ObjectId.isValid(videoId)) {
    invalidIds.push("video ID");
  }

  if (invalidIds.length > 0) {
    return res
      .status(400)
      .json({ success: false, message: `Invalid ${invalidIds.join(" and ")}` });
  }

  next();
};
