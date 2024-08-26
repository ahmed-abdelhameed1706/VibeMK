import express from "express";

const router = express.Router();

import {
  addVideo,
  updateVideo,
  deleteVideo,
  getVideosForUserPerGroup,
  addUserToSeenBy,
} from "../controllers/video.controller.js";

import { validateVideoObjectId } from "../middlewares/validateVideoObjectId.js";

router.post("/add", validateVideoObjectId, addVideo);
router.put("/update", validateVideoObjectId, updateVideo);
router.delete("/delete", validateVideoObjectId, deleteVideo);
router.get("/user", getVideosForUserPerGroup);
router.put("/seen", addUserToSeenBy);

export default router;
