import User from "../models/user.model.js";
import Video from "../models/video.model.js";
import Group from "../models/group.model.js";

import mongoose from "mongoose";

export const addVideo = async (req, res) => {
  try {
    const { url, groupId } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!url) {
      return res
        .status(400)
        .json({ success: false, message: "URL is required" });
    }

    if (!groupId) {
      return res
        .status(400)
        .json({ success: false, message: "Group ID is required" });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    if (!group.members.includes(user._id)) {
      return res
        .status(403)
        .json({ success: false, message: "User not in group" });
    }

    const video = new Video({
      url,
      group: groupId,
      owner: user._id,
      seenBy: [user._id],
    });

    user.videos.push(video._id);
    group.videos.push(video._id);

    await user.save();
    await group.save();
    await video.save();

    res
      .status(200)
      .json({ success: true, message: "Video added successfully", video });
  } catch (error) {
    console.error("Error in addVideo controller: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getVideo = async (req, res) => {
  try {
    const { videoId } = req.query;
    const user = await User.findById(req.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!videoId) {
      return res
        .status(400)
        .json({ success: false, message: "Video ID is required" });
    }

    const video = await Video.findById(videoId).populate("owner", "fullName");

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    res.status(200).json({
      success: true,
      message: "Video retrieved successfully",
      video,
    });
  } catch (error) {
    console.error("Error in getVideo controller: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const { videoId, updatedUrl } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!videoId) {
      return res
        .status(400)
        .json({ success: false, message: "Video ID is required" });
    }

    if (!updatedUrl) {
      return res
        .status(400)
        .json({ success: false, message: "URL is required" });
    }

    const video = await Video.findById(videoId);

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    if (!video.owner.equals(user._id)) {
      return res
        .status(403)
        .json({ success: false, message: "User not owner of video" });
    }

    video.url = updatedUrl;
    video.updatedAt = new Date();

    await video.save();

    res
      .status(200)
      .json({ success: true, message: "Video updated successfully", video });
  } catch (error) {
    console.error("Error in updateVideo controller: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteVideo = async (req, res) => {
  const session = await mongoose.startSession(); // Start a session for transaction
  session.startTransaction();

  try {
    const { videoId } = req.body;

    if (!videoId) {
      return res
        .status(400)
        .json({ success: false, message: "Video ID is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    if (!video.owner.equals(user._id)) {
      return res
        .status(403)
        .json({ success: false, message: "User not owner of video" });
    }

    const group = await Group.findById(video.group);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    // Use $pull to directly remove videoId from arrays in the database
    await User.updateOne(
      { _id: user._id },
      { $pull: { videos: video._id } }
    ).session(session);
    await Group.updateOne(
      { _id: group._id },
      { $pull: { videos: video._id } }
    ).session(session);

    await Video.findByIdAndDelete(videoId).session(session);

    await session.commitTransaction(); // Commit the transaction
    session.endSession();

    return res
      .status(200)
      .json({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    await session.abortTransaction(); // Abort the transaction on error
    session.endSession();

    console.error("Error in deleteVideo controller: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getVideosForUserPerGroup = async (req, res) => {
  try {
    const { requestedUserId, groupId } = req.query;
    const user = await User.findById(req.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!requestedUserId) {
      return res
        .status(400)
        .json({ success: false, message: "Requested user ID is required" });
    }

    if (!groupId) {
      return res
        .status(400)
        .json({ success: false, message: "Group ID is required" });
    }

    const requestedUser = await User.findById(requestedUserId);

    if (!requestedUser) {
      return res
        .status(404)
        .json({ success: false, message: "Requested user not found" });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    if (
      !group.members.includes(requestedUser._id) ||
      !group.members.includes(user._id)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Both Users must be in the group" });
    }

    const videos = await Video.find({
      group: groupId,
      owner: requestedUserId,
    })
      .sort({ createdAt: -1 })
      .populate("seenBy", "fullName");

    if (!videos) {
      return res
        .status(404)
        .json({ success: false, message: "No videos found" });
    }

    res.status(200).json({
      success: true,
      message: "Videos retrieved successfully",
      videos,
    });
  } catch (error) {
    console.error("Error in getVideosForUserPerGroup controller: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const addUserToSeenBy = async (req, res) => {
  try {
    const { videoId } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!videoId) {
      return res
        .status(400)
        .json({ success: false, message: "Video ID is required" });
    }

    const video = await Video.findById(videoId);

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    if (!video.seenBy.includes(user._id)) {
      video.seenBy.push(user._id);
      await video.save();
    }

    const videoViewers = await User.find({ _id: { $in: video.seenBy } });

    if (!videoViewers) {
      return res
        .status(404)
        .json({ success: false, message: "No viewers found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User viewed the video", videoViewers });
  } catch (error) {
    console.error("Error in addUserToSeenBy controller: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
