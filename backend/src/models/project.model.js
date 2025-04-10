import mongoose from "mongoose"

const memberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["Leader", "Co-Leader", "Member"],
    default: "Member",
  },
})

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  status: {
    type: String,
    enum: ["active", "archived", "finished"],
    default: "active",
  },

  deadline: {
    type: Date,
    default: null,
    validate: {
      validator: (value) => {
        if (!value) return true
        return value > new Date()
      },
      message: (props) => "Deadline must be a future date!",
    },
  },

  members: [memberSchema],

  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ],

  chat: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],

  invitations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  createdAt: { type: Date, default: Date.now },
})

export const Project = mongoose.model("Project", projectSchema)