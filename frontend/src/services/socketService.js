import { io } from "socket.io-client"
import { addNotification, fetchNotifications } from "../store/slices/notificationSlice"
import { addMessage, updateUnreadCount } from "../store/slices/chatSlice"

let socket = null
let store = null
let isInitializing = false

export const initializeSocket = (token, reduxStore) => {
  console.log("I am on");
  
  // Save store reference for later use
  store = reduxStore

  // If already initializing, don't start another initialization
  if (isInitializing) {
    console.log("Socket is already being initialized, waiting...")
    return socket
  }

  // If socket exists and is connected, just return it
  if (socket && socket.connected) {
    console.log("Socket already initialized and connected:", socket.id)
    return socket
  }

  // If socket exists but is disconnected, try to reconnect
  if (socket) {
    console.log("Socket exists but is disconnected, reconnecting...")
    socket.connect()
    return socket
  }

  const API_URL = import.meta.env.VITE_API_URL

  console.log("Creating new socket connection to:", API_URL)
  isInitializing = true

  try {
    socket = io(API_URL, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    })

    socket.on("connect", () => {
      console.log("Socket connected with ID:", socket.id)
      isInitializing = false

      // Fetch notifications when socket connects to ensure we have the latest data
      if (store) {
        store.dispatch(fetchNotifications())
      }
    })

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected, reason:", reason)
    })

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message)
      isInitializing = false
    })

    // Listen for notifications
    socket.on("notification", (notification) => {
      console.log("New notification received:", notification)

      if (!store) {
        console.warn("Store not available, can't dispatch notification")
        return
      }

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
      console.log("New message received via socket:", message)

      if (!store) {
        console.warn("Store not available, can't dispatch message")
        return
      }

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
      console.log("Message sent confirmation received:", message)

      if (!store) {
        console.warn("Store not available, can't dispatch message confirmation")
        return
      }

      // Also add the sent message to the store to ensure it appears in the UI
      store.dispatch(addMessage({ projectId: message.projectId, message }))
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
  } catch (error) {
    console.error("Error initializing socket:", error)
    isInitializing = false
    return null
  }
}

export const disconnectSocket = () => {
  if (socket) {
    console.log("Manually disconnecting socket")
    socket.disconnect()
    socket = null
  }
  isInitializing = false
}

export const getSocket = () => {
  if (!socket) {
    console.warn("Socket not initialized yet")
    return null
  }
  return socket
}

// Request notification permissions
export const requestNotificationPermission = async () => {
  if ("Notification" in window) {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      await Notification.requestPermission()
    }
  }
}

// Safe socket emit function
const safeEmit = (event, data) => {
  if (!socket) {
    console.warn(`Cannot emit ${event} - socket not initialized`)
    return false
  }

  if (!socket.connected) {
    console.warn(`Cannot emit ${event} - socket not connected`)
    socket.connect() // Try to reconnect
    return false
  }

  socket.emit(event, data)
  return true
}

// Chat-related socket methods
export const joinProjectChat = (projectId) => {
  console.log(`Attempting to join project chat: ${projectId}`)
  return safeEmit("join_project_chat", projectId)
}

export const leaveProjectChat = (projectId) => {
  console.log(`Attempting to leave project chat: ${projectId}`)
  return safeEmit("leave_project_chat", projectId)
}

export const sendMessage = (message) => {
  console.log("Attempting to send message:", message)

  // If we have a store but no socket or connection, we can still add the message to the store
  // to give immediate feedback to the user
  if (store && (!socket || !socket.connected)) {
    console.log("Socket not available, adding message to store directly")
    store.dispatch(
      addMessage({
        projectId: message.projectId,
        message: {
          ...message,
          pending: true, // Mark as pending since it hasn't been sent to the server
        },
      }),
    )
  }

  return safeEmit("send_message", message)
}

export const sendTypingStatus = (projectId, isTyping) => {
  return safeEmit("typing", { projectId, isTyping })
}

export const markMessagesAsRead = (projectId) => {
  return safeEmit("mark_messages_read", { projectId })
}
