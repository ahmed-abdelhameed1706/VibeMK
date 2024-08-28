import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import Video from "../models/video.model.js";
import { generateGroupRandomCode } from "../utils/generateGroupRandomCode.js";
import { sendGroupInvitationEmail } from "../mail/groupEmails.js";

export const createGroup = async (req, res) => {
  try {
    let code;
    let codeExists = true;
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    while (codeExists) {
      code = generateGroupRandomCode(4);
      const groupExists = await Group.findOne({ code });
      if (!groupExists) {
        codeExists = false;
      }
    }

    const group = new Group({
      name,
      code,
      members: [user._id],
    });

    await group.save();

    user.groups.push(group._id);

    await user.save();

    res.status(201).json({
      success: true,
      message: "Group Created Successfully",
      group,
    });
  } catch (error) {
    console.error("Error in createGroup controller: ", error);
    res.status(500).json({ message: "Error in createGroup" });
  }
};

export const getGroup = async (req, res) => {
  try {
    const groupCode = req.params.code;
    const user = await User.findById(req.userId);
    if (!groupCode) {
      return res
        .status(400)
        .json({ success: false, message: "Group code is required" });
    }

    const group = await Group.findOne({ code: groupCode, members: user._id });

    if (!group) {
      return res.status(404).json({
        success: false,
        message:
          "You are not a part of this group, join using the joining form.",
      });
    }

    const populatedGroup = await group.populate({
      path: "members",
      select: "-password",
      populate: {
        path: "videos",
        match: { _id: { $in: group.videos } }, // Filter to include only videos that belong to the group
        select: "url updatedAt seenBy",
      },
    });

    res.status(200).json({ success: true, group: populatedGroup });
  } catch (error) {
    console.error("Error in getGroup controller: ", error);
    res.status(500).json({ succes: false, message: "Error in getGroup" });
  }
};

export const getGroupsForUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const groups = await Group.find({ members: user._id });

    res.status(200).json({ success: true, groups });
  } catch (error) {
    console.error("Error in getGroupsForUser controller: ", error);
    res.status(500).json({ message: "Error in getGroupsForUser" });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const user = await User.findById(req.userId);

    if (!groupId) {
      return res
        .status(400)
        .json({ success: false, message: "Group code is required" });
    }

    const group = await Group.findOne({ _id: groupId, members: user._id });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "You are not part of that group, join using the joining form",
      });
    }

    const videosToDelete = await Video.find({
      owner: user._id,
      group: groupId,
    });
    const videoIdsToDelete = videosToDelete.map((video) => video._id);
    await Video.deleteMany({ _id: { $in: videoIdsToDelete } });

    // Step 2: Remove references to these videos from the User collection
    await user.updateOne({ $pull: { videos: { $in: videoIdsToDelete } } });

    // Step 3: Remove references to these videos from the Group collection
    await group.updateOne({ $pull: { videos: { $in: videoIdsToDelete } } });

    // Step 4: Remove user from group members
    await group.updateOne({ $pull: { members: user._id } });

    // Step 5: Remove group from user groups
    await user.updateOne({ $pull: { groups: group._id } });

    const updatedGroup = await Group.findById(groupId);

    if (updatedGroup.members.length === 0) {
      await Video.deleteMany({ group: groupId });

      await Group.findByIdAndDelete(groupId);
    }

    res.status(200).json({ success: true, message: "Left group successfully" });
  } catch (error) {
    console.error("Error in leaveGroup controller: ", error);
    res.status(500).json({ success: false, message: "Error in leaveGroup" });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.userId);

    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Code is required" });
    }

    const group = await Group.findOne({ code });

    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    if (group.members.includes(user._id)) {
      return res
        .status(400)
        .json({ success: false, message: "Already a member of this group" });
    }

    group.members.push(user._id);
    await group.save();

    user.groups.push(group._id);

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Joined group successfully", group });
  } catch (error) {
    console.error("Error in joinGroup controller: ", error);
    res.status(500).json({ success: false, message: "Error in joinGroup" });
  }
};

export const sendInvitationEmail = async (req, res) => {
  try {
    const { code } = req.params;
    const { email } = req.body;

    if (!code || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Code and email are required" });
    }

    const group = await Group.findOne({ code });

    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }
    const sendingUser = await User.findById(req.userId);

    const user = await User.findOne({ email });

    if (user && group.members.includes(user._id)) {
      return res
        .status(400)
        .json({ success: false, message: "User is already a member" });
    }

    await sendGroupInvitationEmail(
      email,
      code,
      sendingUser.fullName,
      group.name
    );

    res
      .status(200)
      .json({ success: true, message: "Invitation email sent successfully" });
  } catch (error) {
    console.error("Error in sendInvitationEmail controller: ", error);
    res
      .status(500)
      .json({ success: false, message: "Error in sendInvitationEmail" });
  }
};

// export const getGroupMembers = async (req, res) => {
//   try {
//     const groupCode = req.params.code;
//     const user = await User.findById(req.userId);

//     if (!groupCode) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Group Code is required" });
//     }

//     const group = await Group.findOne({ code: groupCode, members: user._id });

//     if (!group) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Group not found" });
//     }

//     const members = await User.find({ _id: { $in: group.members } });

//     res.status(200).json({ success: true, members });
//   } catch (error) {
//     console.error("Error in getGroupMembers controller: ", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error in getGroupMembers" });
//   }
// };

// export const updateGroup = async (req, res) => {};
