import { Server } from "socket.io"
import jwt from "jsonwebtoken"

// Map to store active user connections
const userSocketMap = new Map()

const setupSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000, // Increase ping timeout to prevent disconnections
  })

  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    console.log("Socket auth token received:", token ? "Token present" : "Token missing") // Log without exposing token

    if (!token) {
      console.log("Socket auth error: Token missing")
      return next(new Error("Authentication error: Token missing"))
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-fallback-secret")
      socket.userId = decoded.id
      console.log("Socket authenticated for user:", decoded.id)
      next()
    } catch (error) {
      console.log("Socket auth error:", error.message)
      return next(new Error("Authentication error: Invalid token"))
    }
  })

  io.on("connection", (socket) => {
    const userId = socket.userId

    console.log(`User connected: ${userId} with socket ID: ${socket.id}`)

    // Store the socket connection for this user
    userSocketMap.set(userId, socket.id)

    // Handle joining project chat rooms
    socket.on("join_project_chat", (projectId) => {
      socket.join(`project:${projectId}`)
      console.log(`User ${userId} joined project chat: ${projectId}`)
    })

    // Handle leaving project chat rooms
    socket.on("leave_project_chat", (projectId) => {
      socket.leave(`project:${projectId}`)
      console.log(`User ${userId} left project chat: ${projectId}`)
    })

    // Handle new chat messages
    socket.on("send_message", (message) => {
      console.log(`Received message from user ${userId} for project ${message.projectId}:`, message)

      // Broadcast to all members in the project room except sender
      socket.to(`project:${message.projectId}`).emit("new_message", message)

      // Confirm to sender that message was sent
      socket.emit("message_sent", message)

      console.log(`Message broadcast to project:${message.projectId} and confirmation sent to sender`)
    })

    // Handle typing indicator
    socket.on("typing", ({ projectId, isTyping }) => {
      socket.to(`project:${projectId}`).emit("user_typing", {
        userId,
        isTyping,
        projectId,
      })
    })

    // Handle message read status
    socket.on("mark_messages_read", ({ projectId }) => {
      // Broadcast to all members that this user has read messages
      socket.to(`project:${projectId}`).emit("messages_read", {
        userId,
        projectId,
      })
    })

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`)
      userSocketMap.delete(userId)
    })
  })

  return { io, userSocketMap }
}

// Function to send notification to a specific user
const sendNotificationToUser = (io, userSocketMap, userId, notification) => {
  const socketId = userSocketMap.get(userId.toString())

  if (socketId) {
    console.log(`Sending notification to user ${userId} with socket ID ${socketId}`)
    io.to(socketId).emit("notification", notification)
  } else {
    console.log(`User ${userId} is not connected, notification not sent`)
  }
}

// Function to send message to a project chat room
const sendMessageToProject = (io, projectId, message, excludeUserId = null) => {
  console.log(`Sending message to project ${projectId}:`, message)

  if (excludeUserId) {
    const socketId = userSocketMap.get(excludeUserId)
    if (socketId) {
      io.to(`project:${projectId}`).except(socketId).emit("new_message", message)
    } else {
      io.to(`project:${projectId}`).emit("new_message", message)
    }
  } else {
    io.to(`project:${projectId}`).emit("new_message", message)
  }
}

export { setupSocketIO, sendNotificationToUser, sendMessageToProject }
