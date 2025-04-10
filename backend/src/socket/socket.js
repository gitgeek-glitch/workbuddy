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
  })

  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error("Authentication error: Token missing"))
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-fallback-secret")
      socket.userId = decoded.id
      next()
    } catch (error) {
      return next(new Error("Authentication error: Invalid token"))
    }
  })

  io.on("connection", (socket) => {
    const userId = socket.userId

    console.log(`User connected: ${userId}`)

    // Store the socket connection for this user
    userSocketMap.set(userId, socket.id)

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
    io.to(socketId).emit("notification", notification)
  }
}

export { setupSocketIO, sendNotificationToUser }
