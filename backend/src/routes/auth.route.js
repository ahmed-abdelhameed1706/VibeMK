import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, getMe);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);
export default router;
