import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    uploader: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", required: true 
    },
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Project", 
        required: true 
    },
    url: { 
        type: String, 
        required: true 
    }, // Cloudinary URL
    fileName: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String 
    }, // MIME type
    status: {
      type: String,
      enum: ["Final", "Under-Observation"],
      default: "Under-Observation",
    },
    approvedByLeader: { 
        type: Boolean, 
        default: false 
    }, // for co-leader's approval
    uploadedAt: { 
        type: Date, 
        default: Date.now 
    },
  });
  
  export const File = mongoose.model("File", fileSchema);
  