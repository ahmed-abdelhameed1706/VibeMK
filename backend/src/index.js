import express from "express";
import dotenv from "dotenv";

import authRouter from "./routes/auth.route.js";

import { connectToMongo } from "./DB/connectToMongo.js";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  connectToMongo();
  console.log("Server is running on port", PORT);
});
