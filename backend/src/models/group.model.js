import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 32,
      minLength: 3,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;
