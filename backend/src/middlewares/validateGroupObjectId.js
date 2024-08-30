import mongoose from "mongoose";

export const validateGroupObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid group ID" });
  }

  next();
};
