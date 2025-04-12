import { Message } from "../models/message.model.js"
import { Project } from "../models/project.model.js"
import { ReadReceipt } from "../models/readReceipt.model.js"
import winston from "winston"

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
    }),
    new winston.transports.File({ filename: "message-logs.log" }),
  ],
})

// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { projectId, content } = req.body
    const userId = req.user._id

    // Validate required fields
    if (!projectId || !content) {
      return res.status(400).json({
        message: "Project ID and message content are required",
        data: [],
        code: 400,
      })
    }

    // Find the project
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        data: [],
        code: 404,
      })
    }

    // Check if user is a member of the project
    const isMember = project.members.some((member) => member.userId.equals(userId))

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
        data: [],
        code: 403,
      })
    }

    // Create new message
    const newMessage = new Message({
      sender: userId,
      projectId,
      content,
    })

    await newMessage.save()

    // Add message to project's chat array
    project.chat.push(newMessage._id)
    await project.save()

    // Populate sender information for the response
    const populatedMessage = await Message.findById(newMessage._id).populate("sender", "fullName username")

    // Create read receipts for all project members
    await createReadReceipts(project.members, newMessage._id, userId)

    // Send message via socket to all project members
    if (global.io) {
      const messageToSend = {
        ...populatedMessage.toObject(),
        isNew: true,
      }

      // Use the socket function to send the message to the project room
      global.io.to(`project:${projectId}`).emit("new_message", messageToSend)
    }

    logger.info(`${new Date().toISOString()} - Success: Message created with ID: ${newMessage._id}`)

    return res.status(201).json({
      message: "Message sent successfully",
      data: [populatedMessage],
      code: 201,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error creating message - ${error.message}`)
    return res.status(500).json({
      message: "Internal Server Error",
      data: [],
      code: 500,
    })
  }
}

// Get messages for a project
export const getProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params
    const userId = req.user._id
    const { page = 1, limit = 50 } = req.query

    // Find the project
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        data: [],
        code: 404,
      })
    }

    // Check if user is a member of the project
    const isMember = project.members.some((member) => member.userId.equals(userId))

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
        data: [],
        code: 403,
      })
    }

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Get messages with pagination, sorted by timestamp (newest first)
    const messages = await Message.find({ projectId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))
      .populate("sender", "fullName username")

    // Get total count for pagination
    const totalMessages = await Message.countDocuments({ projectId })

    // Mark messages as read for this user
    await markMessagesAsRead(projectId, userId)

    logger.info(`${new Date().toISOString()} - Success: Retrieved ${messages.length} messages for project ${projectId}`)

    return res.status(200).json({
      message: "Messages retrieved successfully",
      data: [
        {
          messages: messages.reverse(), // Reverse to show oldest first
          pagination: {
            total: totalMessages,
            page: Number.parseInt(page),
            limit: Number.parseInt(limit),
            pages: Math.ceil(totalMessages / Number.parseInt(limit)),
          },
        },
      ],
      code: 200,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error retrieving messages - ${error.message}`)
    return res.status(500).json({
      message: "Internal Server Error",
      data: [],
      code: 500,
    })
  }
}

// Get unread message counts for all user's projects
export const getUnreadMessageCounts = async (req, res) => {
  try {
    const userId = req.user._id

    // Find all projects where user is a member
    const projects = await Project.find({ "members.userId": userId }).select("_id name")

    // Initialize result object
    const unreadCounts = {}

    // For each project, count unread messages
    for (const project of projects) {
      const count = await getUnreadCountForProject(project._id, userId)
      unreadCounts[project._id] = {
        projectId: project._id,
        projectName: project.name,
        unreadCount: count,
      }
    }

    logger.info(`${new Date().toISOString()} - Success: Retrieved unread counts for user ${userId}`)

    return res.status(200).json({
      message: "Unread message counts retrieved successfully",
      data: [unreadCounts],
      code: 200,
    })
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error retrieving unread counts - ${error.message}`)
    return res.status(500).json({
      message: "Internal Server Error",
      data: [],
      code: 500,
    })
  }
}

// Helper function to create read receipts for a new message
const createReadReceipts = async (members, messageId, senderId) => {
  try {
    const message = await Message.findById(messageId)

    // Create read receipts for all members except the sender
    const receipts = []
    for (const member of members) {
      // Skip the sender (they've already "read" their own message)
      if (member.userId.toString() === senderId.toString()) continue

      const receipt = new ReadReceipt({
        userId: member.userId,
        messageId,
        projectId: message.projectId,
        read: false,
        timestamp: null,
      })

      await receipt.save()
      receipts.push(receipt)
    }

    return receipts
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error creating read receipts - ${error.message}`)
    return []
  }
}

// Helper function to mark messages as read
const markMessagesAsRead = async (projectId, userId) => {
  try {
    // Find all unread receipts for this user and project
    const unreadReceipts = await ReadReceipt.find({
      userId,
      projectId,
      read: false,
    })

    // Mark all as read
    for (const receipt of unreadReceipts) {
      receipt.read = true
      receipt.timestamp = new Date()
      await receipt.save()
    }

    // Emit socket event to update unread counts for this user
    if (global.io && global.userSocketMap) {
      const socketId = global.userSocketMap.get(userId.toString())
      if (socketId) {
        global.io.to(socketId).emit("messages_read", { projectId })
      }
    }

    return unreadReceipts.length
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error marking messages as read - ${error.message}`)
    return 0
  }
}

// Helper function to get unread count for a project
const getUnreadCountForProject = async (projectId, userId) => {
  try {
    // Count unread receipts for this user and project
    const count = await ReadReceipt.countDocuments({
      userId,
      projectId,
      read: false,
    })

    return count
  } catch (error) {
    logger.error(`${new Date().toISOString()} - Error: Error counting unread messages - ${error.message}`)
    return 0
  }
}
