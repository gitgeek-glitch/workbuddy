import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },

  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please provide a valid email address"], 
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password should be at least 8 characters"], 
  },

  phone: {
    type: String,
    match: [/^\+?\d{10,15}$/, "Please provide a valid phone number"],
    trim: true,
  },

  school: {
    type: String,
    trim: true,
  },

  role: {
    type: String,
    default: "None",
  },

  bio: {
    type: String,
    maxlength: 500,
    trim: true,
  },

  skills: {
    type: [String],
    default: [],
  },

  joinedDate: {
    type: Date,
    default: Date.now,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("User", userSchema);
