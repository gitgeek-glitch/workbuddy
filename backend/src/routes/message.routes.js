// routes/message.routes.js
import express from "express"
import { createMessage, getProjectMessages, getUnreadMessageCounts, deleteMessage } from "../controllers/message.controller.js"
import { authenticateJWT } from "../middlewares/auth.middleware.js"

const router = express.Router()

// Apply authentication middleware to all message routes
router.use(authenticateJWT)

// Create a new message
router.post("/", createMessage)

// Get messages for a project
router.get("/project/:projectId", getProjectMessages)

// Get unread message counts for all user's projects
router.get("/unread", getUnreadMessageCounts)

// Delete a message
router.delete("/:messageId", deleteMessage)

export default router