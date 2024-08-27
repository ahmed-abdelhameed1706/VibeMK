import mongoose from "mongoose";

export const validateUserObjectId = (req, res, next) => {
  const { requestedUserId, groupId } = req.query;
  console.log("Received requestedUserId:", requestedUserId);

  if (
    !mongoose.Types.ObjectId.isValid(requestedUserId) ||
    !mongoose.Types.ObjectId.isValid(groupId)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid user or group ID" });
  }

  next();
};
