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
    const { updatedUrl } = req.body;
    const { videoId } = req.params;
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

    const video = await Video.findById(videoId).populate("seenBy", "fullName");

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
    const { videoId } = req.params;

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
    const { requestedUserId, groupId } = req.params;
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

export const starVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
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

    if (user.starredVideos.includes(video._id)) {
      user.starredVideos.pull(video._id);
      await user.save();
    } else {
      user.starredVideos.push(video._id);
      await user.save();
    }

    const starredVideos = await Video.find({
      _id: { $in: user.starredVideos },
    })
      .sort({ createdAt: -1 })
      .populate("seenBy", "fullName");

    if (!starredVideos) {
      return res
        .status(404)
        .json({ success: false, message: "No starred videos found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Video starred by user", starredVideos });
  } catch (error) {
    console.error("Error in starVideo controller: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getStarredVideos = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("starredVideos");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const starredVideos = await Video.find({
      _id: { $in: user.starredVideos },
    })
      .sort({ createdAt: -1 })
      .populate("seenBy", "fullName");

    if (!starredVideos) {
      return res
        .status(404)
        .json({ success: false, message: "No starred videos found" });
    }

    res.status(200).json({
      success: true,
      message: "Starred videos retrieved",
      starredVideos,
    });
  } catch (error) {
    console.error("Error in getStarredVideos controller: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserVideos = async (req, res) => {
  try {
    const { selectedUserId, groupId } = req.query;
    const authenticatedUserId = req.userId;

    if (!selectedUserId) {
      return res
        .status(400)
        .json({ success: false, message: "Selected user ID is required" });
    }

    if (!groupId) {
      return res
        .status(400)
        .json({ success: false, message: "Group ID is required" });
    }

    // Find authenticated user and ensure they are part of the group
    const authenticatedUser = await User.findById(authenticatedUserId);

    if (!authenticatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "Authenticated user not found" });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    if (
      !group.members.includes(selectedUserId) ||
      !group.members.includes(authenticatedUserId)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Both users must be in the group" });
    }

    // Retrieve selected user’s videos
    const selectedUserVideos = await Video.find({
      group: groupId,
      owner: selectedUserId,
    })
      .sort({ createdAt: -1 })
      .populate("seenBy", "fullName");

    if (!selectedUserVideos) {
      return res.status(404).json({
        success: false,
        message: "No videos found for the selected user",
      });
    }

    // Retrieve authenticated user’s starred videos
    const starredVideos = await Video.find({
      _id: { $in: authenticatedUser.starredVideos },
    })
      .sort({ createdAt: -1 })
      .populate("seenBy", "fullName");

    if (!starredVideos) {
      return res
        .status(404)
        .json({ success: false, message: "No starred videos found" });
    }

    res.status(200).json({
      success: true,
      message: "Videos retrieved successfully",
      userVideos: selectedUserVideos,
      starredVideos,
    });
  } catch (error) {
    console.error("Error in getUserVideos controller: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
