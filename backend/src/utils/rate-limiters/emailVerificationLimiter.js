import rateLimit from "express-rate-limit";

export const resendVerificationEmailLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 1, // Limit each email to 1 request per windowMs
  keyGenerator: (req, res) => {
    // Use email as the key for rate limiting
    return req.body.email ? req.body.email.toLowerCase() : "";
  },
  message: {
    success: false,
    message:
      "You can only request a verification email once every 2 minutes. Please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
