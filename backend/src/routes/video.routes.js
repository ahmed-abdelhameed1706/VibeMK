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
  getVideo,
  starVideo,
  getStarredVideos,
  getUserVideos,
} from "../controllers/video.controller.js";

router.post("/add", validateVideoObjectId, addVideo);
router.put("/update/:videoId", validateVideoObjectId, updateVideo);
router.delete("/delete/:videoId", validateVideoObjectId, deleteVideo);
// router.get("/user", validateUserObjectId, getVideosForUserPerGroup);
router.put("/seen", validateVideoObjectId, addUserToSeenBy);
router.get("/", validateVideoObjectId, getVideo);
router.put("/star/:videoId", validateVideoObjectId, starVideo);
router.get("/starred", getStarredVideos);
router.get("/user", getUserVideos);

export default router;
