import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
  isTokenValid,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { resendVerificationEmailLimiter } from "../utils/rate-limiters/emailVerificationLimiter.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, getMe);

router.post("/verify-email", verifyEmail);
router.post(
  "/resend-verification-email",
  resendVerificationEmailLimiter,
  resendVerificationEmail
);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);
router.post("/is-token-valid/:resetToken", isTokenValid);
export default router;
