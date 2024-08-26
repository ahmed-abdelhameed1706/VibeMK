import express from "express";
import { validateGroupObjectId } from "../middlewares/validateGroupObjectId.js";
import { validateVideoObjectId } from "../middlewares/validateVideoObjectId.js";
import { validateUserObjectId } from "../middlewares/validateUserObjectId.js";

const router = express.Router();

import {
  addVideo,
  updateVideo,
  deleteVideo,
  getVideosForUserPerGroup,
  addUserToSeenBy,
} from "../controllers/video.controller.js";

router.post("/add", validateVideoObjectId, addVideo);
router.put("/update", validateVideoObjectId, updateVideo);
router.delete("/delete", validateVideoObjectId, deleteVideo);
router.get("/user", validateUserObjectId, getVideosForUserPerGroup);
router.put("/seen", validateVideoObjectId, addUserToSeenBy);

export default router;
