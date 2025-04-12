import mongoose from "mongoose"

const readReceiptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: null,
  },
})

// Create a compound index for efficient queries
readReceiptSchema.index({ userId: 1, projectId: 1, read: 1 })

export const ReadReceipt = mongoose.model("ReadReceipt", readReceiptSchema)
