import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - You need to be logged in to access this route",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - You need to be logged in to access this route",
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("error in the protectRoute middleware", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
