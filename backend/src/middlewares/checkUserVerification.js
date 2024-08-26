import User from "../models/user.model.js";

export const checkUserVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "User is not verified" });
    }

    next();
  } catch (error) {
    console.error("Error in checkUserVerification middleware: ", error);
    res.status(500).json({ message: "Error in checkUserVerification" });
  }
};
