import express from "express";

import {
  createGroup,
  getGroup,
  getGroupsForUser,
  joinGroup,
  leaveGroup,
  sendInvitationEmail,
} from "../controllers/group.controller.js";

import { validateGroupObjectId } from "../middlewares/validateGroupObjectId.js";

const router = express.Router();

router.post("/", createGroup);
router.get("/:code", getGroup);
router.get("/", getGroupsForUser);

router.post("/:id/join", joinGroup);
router.post("/:id/leave", validateGroupObjectId, leaveGroup);

router.post("/:code/invite", sendInvitationEmail);

export default router;
