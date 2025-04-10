import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Project" 
    },
    type: {
      type: String,
      enum: ["Invitation", "File-Status", "Role-Change"],
      required: true,
    },
    read: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
  });
  
  export const Notification = mongoose.model("Notification", notificationSchema);
  