import { io } from "socket.io-client"
import { addNotification, fetchNotifications } from "../store/slices/notificationSlice"
import { addMessage, updateUnreadCount } from "../store/slices/chatSlice"

let socket = null

export const initializeSocket = (token, store) => {
  if (socket) {
    socket.disconnect()
  }
  const API_URL = import.meta.env.VITE_API_URL

  socket = io(API_URL, {
    auth: {
      token,
    },
  })

  socket.on("connect", () => {
    console.log("Socket connected")

    // Fetch notifications when socket connects to ensure we have the latest data
    store.dispatch(fetchNotifications())
  })

  socket.on("disconnect", () => {
    console.log("Socket disconnected")
  })

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message)
  })

  // Listen for notifications
  socket.on("notification", (notification) => {
    console.log("New notification received:", notification)

    // Add the notification to the store
    store.dispatch(addNotification(notification))

    // Immediately fetch all notifications to ensure counts are updated correctly
    store.dispatch(fetchNotifications())

    // Show browser notification if supported
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("TeamCollab", {
        body: notification.message,
        icon: "/favicon.ico",
      })
    }
  })

  // Chat-related socket events
  socket.on("new_message", (message) => {
    console.log("New message received:", message)

    // Add the message to the store
    store.dispatch(addMessage({ projectId: message.projectId, message }))

    // Update unread count for this project
    store.dispatch(
      updateUnreadCount({
        projectId: message.projectId,
        count: 1,
        increment: true,
      }),
    )

    // Show browser notification if supported
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("New Message", {
        body: `${message.sender.fullName || message.sender.username}: ${message.content.substring(0, 50)}${message.content.length > 50 ? "..." : ""}`,
        icon: "/favicon.ico",
      })
    }
  })

  socket.on("message_sent", (message) => {
    console.log("Message sent confirmation:", message)
    // We could update the message status here if needed
  })

  socket.on("user_typing", ({ userId, isTyping, projectId }) => {
    // This would be handled by the chat component directly
    console.log(`User ${userId} is ${isTyping ? "typing" : "not typing"} in project ${projectId}`)
  })

  socket.on("messages_read", ({ userId, projectId }) => {
    console.log(`User ${userId} has read messages in project ${projectId}`)
    // Could update read receipts if we're tracking them
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket

// Request notification permissions
export const requestNotificationPermission = async () => {
  if ("Notification" in window) {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      await Notification.requestPermission()
    }
  }
}

// Chat-related socket methods
export const joinProjectChat = (projectId) => {
  if (socket) {
    socket.emit("join_project_chat", projectId)
  }
}

export const leaveProjectChat = (projectId) => {
  if (socket) {
    socket.emit("leave_project_chat", projectId)
  }
}

export const sendMessage = (message) => {
  if (socket) {
    socket.emit("send_message", message)
  }
}

export const sendTypingStatus = (projectId, isTyping) => {
  if (socket) {
    socket.emit("typing", { projectId, isTyping })
  }
}

export const markMessagesAsRead = (projectId) => {
  if (socket) {
    socket.emit("mark_messages_read", { projectId })
  }
}
