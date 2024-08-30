import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateJwtAndSetCookie } from "../utils/generateJwtAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mail/emails.js";
import { validateEmail } from "../utils/validateEmail.js";
import { validatePassword } from "../utils/validatePassword.js";
import crypto from "crypto";

export const register = async (req, res) => {
  try {
    const { email, password, confirmPassword, fullName } = req.body;
    if (!email || !password || !confirmPassword || !fullName) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const passwordValidationErrors = validatePassword(
      password,
      confirmPassword
    );
    if (passwordValidationErrors) {
      return res.status(400).json(passwordValidationErrors);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = generateVerificationToken();

    const newUser = new User({
      email: email.toLowerCase(),
      fullName,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000,
    });

    generateJwtAndSetCookie(res, newUser._id);

    await newUser.save();

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in the register controller", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Please provide the verification code",
      });
    }
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.fullName);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in the verifyEmail controller", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    generateJwtAndSetCookie(res, user._id);

    user.lastLogin = Date.now();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in the login controller", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("jwt", { maxAge: 0 })
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("starredVideos");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("error in the getMe controller", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide the email address",
      });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const resetToken = crypto.randomBytes(64).toString("hex");
    const resetTokenExpiresAt = Date.now() + 10 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendPasswordResetEmail(email, resetUrl);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("error in the forgotPassword controller", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password, confirmPassword } = req.body;

    if (!resetToken || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const passwordValidationErrors = validatePassword(
      password,
      confirmPassword
    );
    if (passwordValidationErrors) {
      return res.status(400).json(passwordValidationErrors);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log("error in the resetPassword controller", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide the email address",
      });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    const verificationToken = generateVerificationToken();

    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      success: true,
      message: "Verification email sent",
    });
  } catch (error) {
    console.log("error in the resendVerificationEmail controller", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const isTokenValid = async (req, res) => {
  const resetToken = req.params.resetToken;
  try {
    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      valid: true,
    });
  } catch (error) {
    console.log("error in the isTokenValid controller", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
