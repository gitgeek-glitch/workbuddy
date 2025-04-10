import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", required: true 
    },
    role: { 
        type: String, enum: ["Leader", "Co-Leader", "Member"], 
        default: "Member" 
    },
});

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    members: [memberSchema], 

    files: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "File"
        }
    ],

    chat: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ],

    invitations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    createdAt: { type: Date, default: Date.now },
});

export const Project = mongoose.model("Project", projectSchema);