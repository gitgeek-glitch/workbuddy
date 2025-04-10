import connectDB from "./src/config/db.js"
import app from "./src/app.js"
import os from "os"
import http from "http"
import { setupSocketIO, sendNotificationToUser } from "./src/socket/socket.js"

const PORT = process.env.PORT || 7000

// Get Local Network IP Address
const getLocalIP = () => {
  const interfaces = os.networkInterfaces()
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address
      }
    }
  }
  return "127.0.0.1"
}

const LOCAL_IP = getLocalIP()

// Create HTTP server
const server = http.createServer(app)

// Connect to MongoDB
connectDB()

// Setup Socket.IO
const { io, userSocketMap } = setupSocketIO(server)

// Make socket.io instance available globally
global.io = io
global.userSocketMap = userSocketMap
global.sendNotificationToUser = sendNotificationToUser

// Start the server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at:`)
  console.log(`   🔹 Local:   http://localhost:${PORT}`)
  console.log(`   🔹 Network: http://${LOCAL_IP}:${PORT}`)
})
