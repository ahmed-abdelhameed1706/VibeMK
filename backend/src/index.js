import express from "express";
import dotenv from "dotenv";

import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import groupRouter from "./routes/group.routes.js";
import videoRouter from "./routes/video.routes.js";

import { checkUserVerification } from "./middlewares/checkUserVerification.js";
import { protectRoute } from "./middlewares/protectRoute.js";

import { connectToMongo } from "./DB/connectToMongo.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use(
  "/api/group",
  protectRoute,
  checkUserVerification,

  groupRouter
);
app.use(
  "/api/video",
  protectRoute,
  checkUserVerification,

  videoRouter
);

app.listen(PORT, () => {
  connectToMongo();
  console.log("Server is running on port", PORT);
});
